'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { schemaLogin } from './validation';
import { FormError } from './formError';
import { ISignin } from '@/types';
import { Button } from '@/components';

import styles from './form.module.css';
import { login, storeToken } from '@/services/apiActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser } from '@/redux/slices/appSlice';

export const SigninForm = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.app);
  const [error, setError] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaLogin),
  });

  const onSubmit = (formData: ISignin) => {
    login(formData)
      .then((res) => {
        console.log(res);
        if (res.detail) {
          setError(res.detail);
        } else {
          dispatch(setUser(formData.username));
          storeToken(res.refresh, 'refresh');
          storeToken(res.access, 'access');
          localStorage.setItem('user', formData.username);
          reset();
          router.replace('/');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // useEffect(() => {
  //   if (user) router.replace('/');
  // }, [user, router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Вход</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <input
          className={styles.input}
          style={{ marginBottom: errors.username ? 0 : 28 }}
          type="text"
          placeholder="Имя пользователя"
          {...register('username')}
        />

        <FormError error={errors.username} />

        <input
          className={styles.input}
          style={{ marginBottom: errors.password ? 0 : 28 }}
          type="password"
          placeholder="Пароль"
          {...register('password')}
        />

        <FormError error={errors.password} />

        <Button type="submit" disabled={!isValid}>
          Войти
        </Button>

        {error && <FormError error={{ message: error }} />}

        <div style={{ marginTop: error ? 0 : 28 }}>
          Нет аккаунта? <Link href="signup">Зарегистрироваться</Link> сейчас.
        </div>
      </form>
    </div>
  );
};
