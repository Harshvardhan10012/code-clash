
// src/app/signup/actions.ts
"use server";

import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Set error on confirmPassword field
});

export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        general?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function signup(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Please check your input.",
      success: false,
    };
  }

  const { name, email, password } = validatedFields.data;

  console.log("Signup attempt with:", { name, email, password });

  // Simulate an API call or database check
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Placeholder: Simulate user already exists
  if (email === "exists@example.com") {
    return {
      errors: { email: ["This email is already registered."] },
      message: "This email is already registered.",
      success: false,
    };
  }

  // Placeholder: Simulate successful user creation
  console.log("Signup successful for:", { name, email });
  // In a real app, you would create the user in the database here
  return {
    message: "Signup successful! You can now log in.",
    success: true,
  };
}
