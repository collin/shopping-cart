import { useCurrentUser } from "../providers/CurrentUserProvider";

export const Logout = () => {
  const [currentUser, setCurrentUser] = useCurrentUser();
  const logout = async () => {
    const response = await fetch(`${location.origin}/api/user/logout`, {
      method: "POST",
    });
    if (!response.ok) {
      console.log("Failed to logout", response.status, response.statusText);
      return;
    }
    setCurrentUser(null);
    window.location.reload();
  };

  return <button onClick={logout}>Logout</button>;
};
