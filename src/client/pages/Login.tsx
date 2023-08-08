import { useRef, useState } from "react";
import { ValidatedInput } from "../components/ValidatedInput";
import { RegisteredUser } from "../../server/api/user";
import { useForceRender } from "../hooks/useForceRender";

export const Login = () => {
  const [authenticatedUser, setAuthenticatedUser] =
    useState<RegisteredUser | null>(null);

  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  return (
    <div>
      {!authenticatedUser && (
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
              setAuthenticatedUser(authenticatedUser);
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
      {authenticatedUser && (
        <>
          <p>Logged in as {authenticatedUser.display_name}</p>
          <p>Your email is {authenticatedUser.email_address}.</p>
        </>
      )}
    </div>
  );
};
