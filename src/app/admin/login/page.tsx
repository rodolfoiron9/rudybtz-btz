'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';

const ADMIN_PASSWORD = 'rudybtz-admin'; // Hardcoded password

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        try {
            window.localStorage.setItem('rudybtz-admin-auth', 'true');
            toast({
                title: 'Login Successful',
                description: 'Redirecting to the admin dashboard...',
            });
            router.push('/admin');
        } catch (error) {
            console.error('Failed to set auth in localStorage', error);
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Could not save authentication status. Please enable localStorage.',
            });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Incorrect password. Please try again.',
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-grid-pattern-dark">
      <Card className="w-full max-w-sm glassmorphism bg-background/80">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20">
                <KeyRound className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black tracking-wider uppercase font-headline">Admin Access</CardTitle>
          <CardDescription>Enter the password to manage content.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-12 text-center"
            />
            <Button type="submit" className="w-full h-12 font-bold transition-all duration-300 shadow-lg hover:shadow-primary/50" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Unlock'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
