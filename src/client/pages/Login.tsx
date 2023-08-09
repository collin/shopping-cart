import { useRef } from "react";
import { ValidatedInput } from "../components/ValidatedInput";
import { useCurrentUser } from "../providers/CurrentUserProvider";

export const Login = () => {
  const [currentUser, setCurrentUser] = useCurrentUser();

  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  return (
    <div>
      {!currentUser && (
        <form
          aria-labelledby="loginFormTitle"
          onSubmit={async (event) => {
            event.preventDefault();
            const payload = JSON.stringify({
              email: emailInput.current?.value,
              password: passwordInput.current?.value,
            });

            try {
              const response = await fetch(
                `${location.origin}/api/user/login`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: payload,
                },
              );
              if (!response.ok) {
                console.log(
                  "ERROR LOGGING IN USER",
                  response.status,
                  response.statusText,
                );
                return;
              }
              const authenticatedUser = await response.json();
              console.log("LOGGED IN USER", authenticatedUser);
              setCurrentUser(authenticatedUser);
            } catch (error) {
              console.log("ERROR LOGGING IN USER", error);
            }
          }}
        >
          <h1 id="loginFormTitle">Login</h1>
          <ValidatedInput
            label="Email"
            type="email"
            ref={emailInput}
            required
            validations={{
              valueMissing: "Email is required",
              typeMismatch: "Please enter a valid email address",
            }}
          />
          <ValidatedInput
            label="Password"
            type="password"
            ref={passwordInput}
            required
            validations={{
              valueMissing: "Password is required",
            }}
          />
          <button type="submit">Login</button>
        </form>
      )}
      {currentUser && (
        <>
          <p>Logged in as {currentUser.display_name}</p>
          <p>Your email is {currentUser.email_address}.</p>
        </>
      )}
    </div>
  );
};
