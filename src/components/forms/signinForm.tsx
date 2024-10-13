'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { login } from '@/services/apiActions';
import { schemaLogin } from './validation';
import { FormError } from './formError';
import { ISignin } from '@/types';
import { Button } from '@/components';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser } from '@/redux/slices/appSlice';
import { showToast } from '@/utils';

import styles from './form.module.css';

export const SigninForm = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.app);
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

  const onSubmit = async (formData: ISignin) => {
    showToast({ message: 'Выполненяется вход...', thisError: false });

    const response = await login(formData);
    if (response) {
      dispatch(setUser(formData.username));
      localStorage.setItem('user', formData.username);
      reset();
      router.replace('/');
      showToast({ message: 'Вы успешно вошли', thisError: false });
    } else {
      showToast({
        message: 'Не найдена активная учетная запись с указанными учетными данными',
        thisError: true,
      });
    }
  };

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

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

        <div style={{ marginTop: 28 }}>
          Нет аккаунта? <Link href="signup">Зарегистрироваться</Link> сейчас.
        </div>
      </form>
    </div>
  );
};
