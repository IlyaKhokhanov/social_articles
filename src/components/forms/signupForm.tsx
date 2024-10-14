'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { registration } from '@/services/apiActions';
import { schemaRegister } from './validation';
import { FormError } from './formError';
import { ISignup } from '@/types';
import { Button } from '@/components';
import { useAppSelector } from '@/redux/hooks';
import { showToast } from '@/utils';

import styles from './form.module.css';

export const SignupForm = () => {
  const { user } = useAppSelector((state) => state.app);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaRegister),
  });

  const onSubmit = async (formData: ISignup) => {
    showToast({ message: 'Идет отправка данных...', thisError: false });

    const response = await registration(formData);
    if (response) {
      reset();
      router.replace('/signin');
      showToast({ message: 'Пользователь зарегистрирован', thisError: false });
    } else {
      showToast({ message: 'Имя пользователя уже занято', thisError: true });
    }
  };

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <input
          className={styles.input}
          style={{ marginBottom: errors.first_name ? 0 : 28 }}
          type="text"
          placeholder="Имя"
          {...register('first_name')}
        />

        <FormError error={errors.first_name} />

        <input
          className={styles.input}
          style={{ marginBottom: errors.last_name ? 0 : 28 }}
          type="text"
          placeholder="Фамилия"
          {...register('last_name')}
        />

        <FormError error={errors.last_name} />
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
          style={{ marginBottom: errors.email ? 0 : 28 }}
          type="text"
          placeholder="Email"
          {...register('email')}
        />

        <FormError error={errors.email} />

        <input
          className={styles.input}
          style={{ marginBottom: errors.password ? 0 : 28 }}
          type="password"
          placeholder="Пароль"
          {...register('password')}
        />

        <FormError error={errors.password} />

        <Button type="submit" disabled={!isValid}>
          Зарегистрироваться
        </Button>

        <div style={{ marginTop: 28 }}>
          Уже есть аккаунт? <Link href="signin">Войти</Link> сейчас.
        </div>
      </form>
    </div>
  );
};
