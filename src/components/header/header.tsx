'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import { Button } from '@/components';
import { removeTokens } from '@/services/apiActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser } from '@/redux/slices/appSlice';

import styles from './header.module.css';

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
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href={`/`}>
            <Button isActive={pathname === `/`}>Статьи</Button>
          </Link>

          {username ? (
            <div className={styles.user}>
              <Link href={`/changepassword`}>
                <Button isActive={pathname === `/changepassword`}>Изменить пароль</Button>
              </Link>
              <Button onClick={logout} isActive={pathname === `/logout`}>
                Выход
              </Button>
            </div>
          ) : (
            <div className={styles.user}>
              <Link href={`/signin`}>
                <Button isActive={pathname === `/signin`}>Вход</Button>
              </Link>
              <Link href={`/signup`}>
                <Button isActive={pathname === `/signup`}>Регистрация</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <Toaster
        position="top-center"
        reverseOrder={true}
        containerStyle={{
          top: 90,
          left: 40,
          bottom: 80,
          right: 40,
        }}
      />
    </>
  );
};
