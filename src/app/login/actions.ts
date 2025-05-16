// src/app/login/actions.ts
"use server";

import { z } from "zod";
import {AuthError} from "next-auth"; // Assuming you might use NextAuth.js later

const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        general?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function login(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Please check your input.",
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  console.log("Login attempt with:", { email, password });

  // Simulate an API call or database check
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Placeholder authentication logic
  if (email === "user@example.com" && password === "password") {
    console.log("Login successful for:", email);
    // In a real app, you would set a session cookie or redirect here
    // For NextAuth.js, you might call signIn()
    return {
      message: "Login successful! Redirecting...",
      success: true,
    };
  } else {
    console.log("Login failed for:", email);
    return {
      errors: { general: ["Invalid email or password."] },
      message: "Invalid email or password.",
      success: false,
    };
  }
}
