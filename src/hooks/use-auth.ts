import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      const authStatus = window.localStorage.getItem('rudybtz-admin-auth');
      if (authStatus !== 'true') {
        router.replace('/admin/login');
      } else {
        setIsAuth(true);
      }
    }
  }, [router]);

  return isAuth;
}
