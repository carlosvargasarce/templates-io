'use client';

import { sidebarLinks } from '@/constants';
import Icon from '@icon-park/react/es/all';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Bottombar.module.scss';

const Bottombar = () => {
  const pathname = usePathname();

  return (
    <section className={styles.bottombar}>
      <div className={styles.links}>
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (pathname.includes(link.route) && link.route.length > 1);

          return (
            <Link
              href={link.route}
              key={link.label}
              className={isActive ? styles.active : ''}
            >
              <Icon type={link.icon} size="24px" />
              <span className={styles.label}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
