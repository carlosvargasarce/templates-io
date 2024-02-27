import UserManager from '@/lib/manager/UserManager';
import { UserProps } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useRequireAuth() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const userManager = new UserManager();
    const user = userManager.getActiveUser();

    if (!user) {
      router.push('/iniciar');
    } else {
      setActiveUser(user);
    }
  }, [router]);

  return activeUser;
}
