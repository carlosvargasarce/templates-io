'use client';

import Title from '@/components/Title/Title';
import { sidebarLinks } from '@/constants/sidebarLinks';
import Icon from '@icon-park/react/es/all';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className={styles.sidebar}>
      <div className={styles.header}>
        {/* TODO: ESTA INFORMACION DEBE DE SER DINAMICA */}
        <Title size="h3" color="whiteColor">
          Hola, Carlos
        </Title>
        <Title size="h5" color="primaryColor">
          Administrador
        </Title>
      </div>

      <div className={styles.links}>
        {sidebarLinks.map((link) => {
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
        <button>
          <Icon type="logout" />
          Salir
        </button>
      </div>
    </section>
  );
};

export default Sidebar;
