'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Button } from '../button/button';

import styles from './writerComment.module.css';
import { addComment, handleJWTRefresh, storeToken } from '@/services/apiActions';
import { useRouter } from 'next/navigation';

export const WriterComment = ({ articleId }: { articleId: number }) => {
  const [username, setUsername] = useState<string | null>(null);
  const { user, commentAnswer } = useAppSelector((state) => state.app);
  const router = useRouter();

  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (user) setUsername(user);
  }, [user]);

  const sendCommentHandler = () => {
    const commentData = {
      content: inputValue,
      parent: commentAnswer || null,
    };

    addComment(articleId, commentData)
      .then((res) => {
        if (res.content) {
          setInputValue('');
          router.refresh();
        } else {
          handleJWTRefresh()
            .then((res) => {
              if (res.access) {
                storeToken(res.access, 'access');
                addComment(articleId, commentData)
                  .then((res) => {
                    if (res.content) {
                      setInputValue('');
                      router.refresh();
                    }
                  })
                  .catch((err) => console.error(err));
              }
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
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
