'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { addArticle, changeArticle, handleJWTRefresh } from '@/services/apiActions';
import { IAddArticle, IArticle } from '@/types';
import { Button } from '@/components';
import { useAppSelector } from '@/redux/hooks';
import { showToast } from '@/utils';

import styles from './form.module.css';

export const ArticleForm = ({ data }: { data?: IArticle }) => {
  const { user } = useAppSelector((state) => state.app);
  const router = useRouter();
  const [dataFields, setDataFields] = useState<IAddArticle>({
    content: data?.content || '',
    title: data?.title || '',
    image: null,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    showToast({ message: 'Статья отправляется...', thisError: false });
    e.preventDefault();

    if (data) {
      const response = await changeArticle(dataFields, data.id);
      if (response) {
        router.replace(`/${data.id}`);
        router.refresh();
        showToast({ message: 'Статья обновлена', thisError: false });
      } else {
        const responseToken = await handleJWTRefresh();

        if (responseToken) {
          const responseSecond = await changeArticle(dataFields, data.id);

          if (responseSecond) {
            router.replace(`/${data.id}`);
            router.refresh();
            showToast({ message: 'Статья обновлена', thisError: false });
          }
        }
      }
    } else {
      const response = await addArticle(dataFields);
      if (response) {
        router.replace('/');
        router.refresh();
        showToast({ message: 'Статья опубликована', thisError: false });
      } else {
        const responseToken = await handleJWTRefresh();

        if (responseToken) {
          const responseSecond = await addArticle(dataFields);

          if (responseSecond) {
            router.replace('/');
            router.refresh();
            showToast({ message: 'Статья опубликована', thisError: false });
          }
        }
      }
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setDataFields((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDataFields((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    setDataFields((prev) => ({
      ...prev,
      image: e.target.files?.length ? e.target.files[0] : null,
    }));
  };

  useEffect(() => {
    if (!user) router.replace('/');
  }, [user, router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{data ? 'Редактировать ' : 'Написать '}статью</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          style={{ marginBottom: 28 }}
          type="text"
          placeholder="Заголовок"
          required
          value={dataFields.title}
          onChange={handleChangeTitle}
        />

        <textarea
          className={styles.input}
          style={{ marginBottom: 28 }}
          placeholder="Контент"
          required
          value={dataFields.content}
          onChange={handleChangeContent}
        />

        <input
          className={styles.input}
          style={{ marginBottom: 28 }}
          type="file"
          multiple={false}
          accept=".jpg, .jpeg, .png"
          onChange={handleChangeImage}
        />

        <Button
          type="submit"
          disabled={Boolean(!dataFields.title.length && !dataFields.content.length)}
        >
          {data ? 'Изменить ' : 'Написать '} статью
        </Button>
      </form>
    </div>
  );
};
