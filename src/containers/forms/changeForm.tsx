'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { schemaChange } from './validation';
import { FormError } from './formError';
import { IChangePassword } from '@/types';
import { Button } from '@/components';
import { changePassword, handleJWTRefresh, login, storeToken } from '@/services/apiActions';
import { useAppSelector } from '@/redux/hooks';

import styles from './form.module.css';

export const ChangeForm = () => {
  const { user } = useAppSelector((state) => state.app);
  const [error, setError] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaChange),
  });

  const onSubmit = (formData: IChangePassword) => {
    changePassword(formData)
      .then((res) => {
        console.log(res);
        if (res.detail) {
          handleJWTRefresh().then((res) => {
            console.log(res);
            if (res.access) {
              storeToken(res.access, 'access');
              changePassword(formData).then((res) => {
                console.log(res);
                if (res.Success) {
                  reset();
                  router.replace('/');
                } else {
                  setError(true);
                }
              });
            }
          });
        }
        if (res.Success) {
          reset();
          router.replace('/');
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (!user) router.replace('/');
  }, [user, router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Изменить пароля</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <input
          className={styles.input}
          style={{ marginBottom: errors.old_password ? 0 : 28 }}
          type="password"
          placeholder="Старый пароль"
          {...register('old_password')}
        />

        <FormError error={errors.old_password} />

        <input
          className={styles.input}
          style={{ marginBottom: errors.password ? 0 : 28 }}
          type="password"
          placeholder="Новый пароль"
          {...register('password')}
        />

        <FormError error={errors.password} />

        <input
          className={styles.input}
          style={{ marginBottom: errors.confirmed_password ? 0 : 28 }}
          type="password"
          placeholder="Подтверждение пароля"
          {...register('confirmed_password')}
        />

        <FormError error={errors.confirmed_password} />

        <Button type="submit" disabled={!isValid}>
          Изменить
        </Button>

        {error && <FormError error={{ message: 'Старый пароль введен неверно' }} />}

        <div style={{ marginTop: error ? 0 : 28 }}>
          Нет аккаунта? <Link href={'/signup'}>Зарегистрируйся</Link> сейчас.
        </div>
      </form>
    </div>
  );
};
