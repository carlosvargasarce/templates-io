'use client';

import Title from '@/components/Title/Title';
import { sidebarLinks } from '@/constants/sidebarLinks';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AuthService } from '@/lib/storage/authService';
import Icon from '@icon-park/react/es/all';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const authService = new AuthService();
  const pathname = usePathname();
  const router = useRouter();
  const user = useRequireAuth();
  const userRole = user?.role || '';

  const handleLogout = () => {
    authService.logout();
    router.push('/iniciar');
  };

  const filteredLinks = sidebarLinks.filter((link) =>
    link.roles.includes(userRole)
  );

  return (
    <section className={styles.sidebar}>
      <div className={styles.header}>
        <Title size="h3" color="whiteColor">
          Hola, {user?.name}
        </Title>
        <Title size="h5" color="primaryColor">
          {user?.role}
        </Title>
      </div>

      <div className={styles.links}>
        {filteredLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (pathname.includes(link.singular) && link.singular.length > 1);

          return (
            <Link
              href={`/${link.route}`}
              key={link.label}
              className={isActive ? styles.active : ''}
            >
              <Icon type={link.icon} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className={styles.signOut}>
        <button onClick={handleLogout}>
          <Icon type="logout" />
          Salir
        </button>
      </div>
    </section>
  );
};

export default Sidebar;
