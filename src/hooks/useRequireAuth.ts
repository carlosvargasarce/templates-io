import { StorageService } from '@/lib/storage/StorageService';
import { UserProps } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useRequireAuth() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const storageService = StorageService.getInstance();
    const user = storageService.getActiveUser();

    if (!user) {
      //router.push('/iniciar');
    } else {
      setActiveUser(user);
    }
  }, [router]);

  return activeUser;
}
