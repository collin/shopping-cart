import { ChangeEvent, forwardRef } from "react";
import { useForceRender } from "../hooks/useForceRender";

type ValidatedInputProps = {
  label: string;
  type: string;
  required?: boolean;
  onChange?: (event: ChangeEvent) => void;
  validations?: {
    [K in keyof ValidityState]?: string;
  };
};
export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  (props, ref) => {
    const forceRender = useForceRender();

    // TODO: figure out what to do with function refs
    if (ref instanceof Function) {
      throw new Error(
        "<ValidatedInput> doesn't know what to do with a function ref.",
      );
    }
    return (
      <>
        <label htmlFor={props.label}>{props.label}</label>
        <input
          type={props.type}
          id={props.label}
          ref={ref}
          required={props.required}
          onChange={(event) => {
            forceRender();
            props.onChange?.(event);
          }}
        />
        {props.validations &&
          Object.entries(props.validations).map(([key, value]) => {
            return (
              ref?.current?.validity[key as keyof ValidityState] && (
                <p key={key} className="error-label">
                  {value}
                </p>
              )
            );
          })}
      </>
    );
  },
);
