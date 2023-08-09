import { PropsWithChildren, createContext, useContext, useState } from "react";
import { RegisteredUser } from "../../server/api/user";

type CurrentUserContextType = [
  RegisteredUser | null,
  React.Dispatch<React.SetStateAction<RegisteredUser | null>>,
];

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined,
);

export const CurrentUserProvider = (props: PropsWithChildren) => {
  const currentUserState = useState<RegisteredUser | null>(null);
  return (
    <CurrentUserContext.Provider value={currentUserState}>
      {props.children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const currentUserState = useContext(CurrentUserContext);
  if (currentUserState === undefined) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return currentUserState;
};
