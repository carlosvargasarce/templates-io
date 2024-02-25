'use client';

import Title from '@/components/Title/Title';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function Page() {
  const user = useRequireAuth();

  return (
    <main>
      <Title color="primaryColor">Inicio</Title>
    </main>
  );
}
