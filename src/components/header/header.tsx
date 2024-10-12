'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import styles from './header.module.css';
import { Button } from '@/components';
import { useRouter } from 'next/navigation';
import { removeTokens } from '@/services/apiActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser } from '@/redux/slices/appSlice';
import { useEffect, useState } from 'react';

export const Header = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.app);
  const pathname = usePathname();
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(null);

  const logout = () => {
    dispatch(setUser(null));
    localStorage.removeItem('user');
    removeTokens();
    router.push('/');
  };

  useEffect(() => {
    setUsername(user);
  }, [user]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={`/`}>
          <Button isActive={pathname === `/`}>Articles</Button>
        </Link>

        {username ? (
          <div className={styles.user}>
            <Link href={`/changepassword`}>
              <Button isActive={pathname === `/changepassword`}>Change password</Button>
            </Link>
            <Button onClick={logout} isActive={pathname === `/logout`}>
              Log out
            </Button>
          </div>
        ) : (
          <div className={styles.user}>
            <Link href={`/signin`}>
              <Button isActive={pathname === `/signin`}>Sign in</Button>
            </Link>
            <Link href={`/signup`}>
              <Button isActive={pathname === `/signup`}>Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
