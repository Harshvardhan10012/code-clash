
// src/components/auth/login-form.tsx
"use client";

import { useActionState } from "react"; // Updated import
import { useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // For redirecting after successful login

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { login, type LoginFormState } from "@/app/login/actions";
import { AlertCircle, Loader2, LogIn, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  // Updated to use useActionState
  const [state, dispatch] = useActionState<LoginFormState, FormData>(login, undefined);
  const { pending } = useFormStatus();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Login Successful",
        description: state.message || "You are now logged in.",
      });
      // Redirect to homepage or dashboard after a short delay
      // In a real app, the server action might handle the redirect cookie or NextAuth would handle session.
      setTimeout(() => {
        router.push("/");
        router.refresh(); // Ensures fresh data on the target page
      }, 1500);
    } else if (state?.message && !state.success && (state.errors?.general || state.errors?.email || state.errors?.password)) {
        toast({
            title: "Login Failed",
            description: state.message,
            variant: "destructive",
        });
    }
  }, [state, router, toast]);


  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <LogIn className="mr-2 h-6 w-6" /> Log In to Code Clash
        </CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          action={(formData) => {
            // Clear previous general errors before dispatching a new action
             if (state?.errors?.general) {
               state.errors.general = undefined;
             }
            dispatch(formData);
          }}
          className="space-y-0"
        >
          <CardContent className="space-y-6">
            {state?.errors?.general && (
              <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{state.errors.general.join(", ")}</p>
              </div>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      disabled={pending}
                      className="bg-background border-input focus:ring-accent"
                    />
                  </FormControl>
                  <FormMessage />
                  {state?.errors?.email && (
                     <p className="text-sm font-medium text-destructive">{state.errors.email.join(", ")}</p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Lock className="mr-2 h-4 w-4 text-muted-foreground"/>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={pending}
                      className="bg-background border-input focus:ring-accent"
                    />
                  </FormControl>
                  <FormMessage />
                   {state?.errors?.password && (
                     <p className="text-sm font-medium text-destructive">{state.errors.password.join(", ")}</p>
                  )}
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={pending}>
              {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              {pending ? "Logging In..." : "Log In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="#" className="underline hover:text-primary">
                Forgot password?
              </Link>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// Note: The LoginButton component was not being used here, 
// so it could be removed or kept if intended for future use.
// For this change, I'm keeping it as it doesn't affect the error.
function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" aria-disabled={pending} disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
      {pending ? "Logging In..." : "Log In"}
    </Button>
  );
}
