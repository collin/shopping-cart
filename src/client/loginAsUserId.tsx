import { sign } from "jsonwebtoken";
import { JWT_SESSION_SECRET } from "./pages/Profile.test";

export function loginAsUserId(userId: number) {
  const authToken = sign({ role: "user" }, JWT_SESSION_SECRET, {
    subject: userId.toString(),
  });
  document.cookie = `auth=${authToken}`;
}
