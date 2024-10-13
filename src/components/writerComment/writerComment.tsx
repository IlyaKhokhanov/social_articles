'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { addComment, handleJWTRefresh } from '@/services/apiActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCommentAnswer } from '@/redux/slices/appSlice';
import { Button } from '../button/button';
import { showToast } from '@/utils';

import styles from './writerComment.module.css';

export const WriterComment = ({ articleId }: { articleId: number }) => {
  const [username, setUsername] = useState<string | null>(null);
  const { user, commentAnswer } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (user) setUsername(user);
  }, [user]);

  const sendCommentHandler = async () => {
    showToast({ message: 'Идет отправка...', thisError: false });
    const commentData = {
      content: inputValue,
      parent: commentAnswer || null,
    };

    const response = await addComment(articleId, commentData);
    if (response) {
      dispatch(setCommentAnswer(null));
      setInputValue('');
      router.refresh();
      showToast({ message: 'Комментарий отправлен', thisError: false });
    } else {
      const responseToken = await handleJWTRefresh();

      if (responseToken) {
        const responseSecond = await addComment(articleId, commentData);

        if (responseSecond) {
          dispatch(setCommentAnswer(null));
          setInputValue('');
          router.refresh();
          showToast({ message: 'Комментарий отправлен', thisError: false });
        }
      }
    }
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  return (
    <div className={styles.wrapper}>
      {username ? (
        <>
          <input
            className={styles.input}
            type="text"
            value={inputValue}
            onChange={inputHandler}
            minLength={1}
            placeholder="Комментарий"
          />
          <Button
            className={styles.btn}
            disabled={Boolean(!inputValue.length)}
            onClick={sendCommentHandler}
          >
            Отправить
          </Button>
        </>
      ) : (
        <h3 className={styles.title}>Необходимо войти, чтобы оставить комментарий</h3>
      )}
    </div>
  );
};
