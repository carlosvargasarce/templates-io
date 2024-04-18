'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useEffect } from 'react';
import TemplateSubject from '../lib/observers/TemplateSubject';
import UserObserver from '../lib/observers/UserObserver';

/**
 * Custom hook for managing the registration and unregistration of observers
 * related to template notifications.
 *
 * @param notifySuccess Function to be called to notify the user of matching templates.
 */
export default function useObserverManager(
  notifySuccess: (message: string) => void
) {
  const activeUser = useRequireAuth();

  useEffect(() => {
    const templateSubject = TemplateSubject.getInstance();

    if (activeUser?.interests) {
      const userObserver = new UserObserver(activeUser.interests, (message) =>
        notifySuccess(message)
      );

      templateSubject.registerObserver(userObserver);

      //return () => templateSubject.removeObserver(userObserver);
    }
  }, [activeUser, notifySuccess]);
}
