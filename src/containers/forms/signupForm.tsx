
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { schemaRegister } from './validation';
import { FormError } from './formError';
import { ISignup } from '@/types';
import { Button } from '@/components';
import { registration } from '@/services/apiActions';
import { useAppSelector } from '@/redux/hooks';

import styles from './form.module.css';

export const SignupForm = () => {
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
    resolver: yupResolver(schemaRegister),
  });

  const onSubmit = (formData: ISignup) => {
    registration(formData)
      .then((res) => {
        if (!res.user) {
          setError(res.username[0] || res.email[0]);
        } else {
          reset();
          router.replace('/signin');
        }
      })
      .catch((err) => console.error(err));
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

        {error && <FormError error={{ message: error }} />}

        <div style={{ marginTop: error ? 0 : 28 }}>
          Уже есть аккаунт? <Link href="signin">Войти</Link> сейчас.
        </div>
      </form>
    </div>
  );
};
