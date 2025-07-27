import { z } from "zod";

export interface UserDto {
  id: number;
  email: string;
  username: string;
  avatarUrl?: string;
  isVerified: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  createdAt: Date;
  isActive: boolean;
}

export const registerSchema = z.object({
  email: z.email("Please enter a valid email."),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username must be 15 characters or fewer")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      "Username must start with a letter and can only contain letters, numbers, and underscores"
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be under 100 characters"),
});

// Infer the type
export type RegisterInput = z.infer<typeof registerSchema>;
