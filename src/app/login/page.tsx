// src/app/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Code Clash',
  description: 'Log in to your Code Clash account.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center py-12">
      <LoginForm />
    </div>
  );
}
