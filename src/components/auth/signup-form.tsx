
// src/components/auth/signup-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { signup, type SignupFormState } from "@/app/signup/actions";
import { AlertCircle, Loader2, LogIn, Mail, Lock, User as UserIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof SignupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, dispatch] = useActionState<SignupFormState, FormData>(signup, undefined);
  const { pending } = useFormStatus();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Signup Successful!",
        description: state.message || "Your account has been created.",
        action: (
          <Button asChild onClick={() => router.push('/login')}>
            <Link href="/login">Login Now</Link>
          </Button>
        ),
      });
      // Optionally redirect or clear form
      form.reset();
      // setTimeout(() => {
      //   router.push("/login");
      // }, 2000);
    } else if (state?.message && !state.success && (state.errors?.general || state.errors?.email || state.errors?.password || state.errors?.name || state.errors?.confirmPassword)) {
        toast({
            title: "Signup Failed",
            description: state.message,
            variant: "destructive",
        });
    }
  }, [state, router, toast, form]);

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <UserIcon className="mr-2 h-6 w-6" /> Create an Account
        </CardTitle>
        <CardDescription>Join Code Clash to start predicting!</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          action={(formData) => {
            if (state?.errors?.general) {
              state.errors.general = undefined;
            }
            dispatch(formData);
          }}
          className="space-y-0"
        >
          <CardContent className="space-y-4">
            {state?.errors?.general && (
              <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{state.errors.general.join(", ")}</p>
              </div>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><UserIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={pending}
                      className="bg-background border-input focus:ring-accent"
                    />
                  </FormControl>
                  <FormMessage />
                  {state?.errors?.name && (
                     <p className="text-sm font-medium text-destructive">{state.errors.name.join(", ")}</p>
                  )}
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Lock className="mr-2 h-4 w-4 text-muted-foreground"/>Confirm Password</FormLabel>
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
                  {state?.errors?.confirmPassword && (
                     <p className="text-sm font-medium text-destructive">{state.errors.confirmPassword.join(", ")}</p>
                  )}
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={pending}>
              {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
              {pending ? "Creating Account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Log In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
