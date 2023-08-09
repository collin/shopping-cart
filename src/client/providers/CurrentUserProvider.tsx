import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { RegisteredUser } from "../../server/api/user";

type CurrentUserContextType = [
  RegisteredUser | null,
  React.Dispatch<React.SetStateAction<RegisteredUser | null>>,
];

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined,
);

export const CurrentUserProvider = (props: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`${location.origin}/api/user/me`, {});
      if (!response.ok) {
        console.log(
          "Failed to fetch profile",
          response.status,
          response.statusText,
        );
        return;
      }
      const profile = await response.json();
      console.log("GOT PROFILE", profile);
      setCurrentUser(profile);
    };
    fetchProfile();
  }, []);

  return (
    <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
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
