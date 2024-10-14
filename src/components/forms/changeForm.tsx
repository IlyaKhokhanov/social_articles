'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { changePassword, handleJWTRefresh } from '@/services/apiActions';
import { schemaChange } from './validation';
import { FormError } from './formError';
import { IChangePassword } from '@/types';
import { Button } from '@/components';
import { useAppSelector } from '@/redux/hooks';
import { showToast } from '@/utils';

import styles from './form.module.css';

export const ChangeForm = () => {
  const { user } = useAppSelector((state) => state.app);
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

  const onSubmit = async (formData: IChangePassword) => {
    showToast({ message: 'Идет отправка данных...', thisError: false });

    const response = await changePassword(formData);
    if (response) {
      reset();
      router.replace('/');
      showToast({ message: 'Пароль обновлен', thisError: false });
    } else if (typeof response === 'string' && response === 'refresh') {
      const responseToken = await handleJWTRefresh();

      if (responseToken) {
        const responseSecond = await changePassword(formData);

        if (responseSecond) {
          reset();
          router.replace('/');
          showToast({ message: 'Пароль обновлен', thisError: false });
        } else if (!responseSecond) {
          showToast({ message: 'Старый пароль введен неверно', thisError: true });
        }
      }
    } else {
      showToast({ message: 'Старый пароль введен неверно', thisError: true });
    }
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
      </form>
    </div>
  );
};
