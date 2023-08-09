import { ChangeEvent, useRef } from "react";
import { ValidatedInput } from "../components/ValidatedInput";
import { useCurrentUser } from "../providers/CurrentUserProvider";

export const Register = () => {
  const [currentUser, setCurrentUser] = useCurrentUser();

  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const passwordConfirmInput = useRef<HTMLInputElement>(null);

  function validatePasswordConfirmation(event: ChangeEvent) {
    if (passwordInput.current?.value !== passwordConfirmInput.current?.value) {
      passwordConfirmInput.current?.setCustomValidity(
        "Password confirmation MUST match password",
      );
    } else {
      passwordConfirmInput.current?.setCustomValidity("");
    }
  }

  return (
    <div>
      {!currentUser && (
        <form
          aria-labelledby="registrationFormTitle"
          onSubmit={async (event) => {
            event.preventDefault();
            // TODO: figure out better way to get field values
            const payload = JSON.stringify({
              displayName: nameInput.current?.value,
              email: emailInput.current?.value,
              password: passwordInput.current?.value,
            });
            console.log(payload);
            console.log(`${location.origin}/api/user/register`);

            try {
              const response = await fetch(
                `${location.origin}/api/user/register`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: payload,
                },
              );
              console.log(response.status, response.statusText);
              if (!response.ok) {
                console.log(
                  "ERROR REGISTERING USER",
                  response.status,
                  response.statusText,
                  await response.json().catch(() => "No JSON"),
                );
              } else {
                // TODO: figure out how to get the response body type without asserting it
                console.log("registration result", currentUser);
                setCurrentUser(await response.json());
              }
            } catch (error) {
              console.error(error);
              console.log("ERROR REGISTERING USER", error);
            }
          }}
        >
          <h1 id="registrationFormTitle">Register</h1>

          <ValidatedInput
            label="Display Name"
            type="text"
            ref={nameInput}
            required
            validations={{
              valueMissing: "Display name is required",
            }}
          />

          <ValidatedInput
            label="Email"
            type="email"
            ref={emailInput}
            required
            validations={{
              valueMissing: "Email address is required",
              typeMismatch: "Please enter a valid email address",
            }}
          />

          <ValidatedInput
            label="Password"
            type="password"
            onChange={validatePasswordConfirmation}
            ref={passwordInput}
            required
            validations={{
              valueMissing: "Password is required",
            }}
          />

          <ValidatedInput
            label="Confirm Password"
            type="password"
            onChange={validatePasswordConfirmation}
            ref={passwordConfirmInput}
            required
            validations={{
              valueMissing: "Password confirmation is required",
              customError: "Password confirmation must match password",
            }}
          />
          <button type="submit">Register</button>
        </form>
      )}

      {currentUser && (
        <>
          <p>
            Hello {currentUser.display_name}, your registration was successful!
          </p>
          <p>Your email is {currentUser.email_address}.</p>
        </>
      )}
    </div>
  );
};
