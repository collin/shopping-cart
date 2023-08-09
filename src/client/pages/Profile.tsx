import { useCurrentUser } from "../providers/CurrentUserProvider";

export const Profile = () => {
  const [currentUser] = useCurrentUser();

  return <p>Hello {currentUser?.display_name}</p>;
};
