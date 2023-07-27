import { ChangeEvent, useState } from "react";
import { RegisteredUser } from "../../server/api/user";

export const Register = () => {
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(
    null,
  );

  function validatePasswordConfirmation(event: ChangeEvent) {
    const password = (document.getElementById("password") as any)?.value;
    const passwordConfirm = (document.getElementById("confirmPassword") as any)
      ?.value;
    if (password !== passwordConfirm) {
      (event.target as any).setCustomValidity("Passwords must match");
    } else {
      (event.target as any).setCustomValidity("");
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          // TODO: figure out better way to get field values
          const payload = JSON.stringify({
            displayName: (event.target as any).querySelector("#displayname")
              .value,
            email: (event.target as any).querySelector("#email").value,
            password: (event.target as any).querySelector("#password").value,
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
              console.log("registration result", registeredUser);
              setRegisteredUser(await response.json());
            }
          } catch (error) {
            console.error(error);
            console.log("ERROR REGISTERING USER", error);
          }
        }}
      >
        <label htmlFor="displayname">Display Name</label>
        <input type="text" id="displayname" required />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={validatePasswordConfirmation}
          required
        />
        <label htmlFor="passwordConfirm">Confirm Password</label>
        <input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          onChange={validatePasswordConfirmation}
          required
        />
        <button type="submit">Register</button>
      </form>

      {registeredUser && (
        <>
          <p>
            Hello {registeredUser.display_name}, your registration was
            successful!
          </p>
          <p>Your email is {registeredUser.email_address}.</p>
        </>
      )}
    </div>
  );
};
