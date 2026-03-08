import { z } from "zod";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(50),
  password: z.string().min(1, "Password is required").max(100),
});

const USERS: Record<string, string> = {
  admin: "admin",
  user: "securepass",
};

export type AuthState = {
  isLoggedIn: boolean;
  username: string | null;
};

export function validateLogin(username: string, password: string): { success: boolean; error?: string } {
  const result = loginSchema.safeParse({ username, password });
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }
  const u = result.data.username;
  const p = result.data.password;
  if (USERS[u] && USERS[u] === p) {
    return { success: true };
  }
  return { success: false, error: "Invalid username or password" };
}

export { loginSchema };
