
// src/app/signup/page.tsx
import { SignupForm } from "@/components/auth/signup-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Code Clash',
  description: 'Create your Code Clash account.',
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center py-12">
      <SignupForm />
    </div>
  );
}
