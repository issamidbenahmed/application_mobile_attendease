"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  // Mock sign-up function
  const handleSignUp = (event: React.FormEvent) => {
     event.preventDefault();
     setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you'd create the user here
      // For this mock, we just navigate to the sign-in page on successful fake signup
       if (email && password) {
        alert("Signup successful! Please sign in."); // Provide feedback
        router.push('/signin');
      } else {
         alert("Please fill in all fields.");
      }
    }, 1500); // Simulate network delay
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Contrôle d'absence</CardTitle>
          <CardDescription>Créez un compte pour commencer</CardDescription>
        </CardHeader>
         <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                id="confirm-password"
                type="password"
                required
                 value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                 <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                 </Button>
                 <p className="text-xs text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/signin" className="underline text-accent hover:text-accent/90">
                        Sign in
                    </Link>
                 </p>
            </CardFooter>
         </form>
      </Card>
    </div>
  );
}
