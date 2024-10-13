'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

import { changeComment, deleteComment, handleJWTRefresh } from '@/services/apiActions';
import { setCommentAnswer } from '@/redux/slices/appSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '../button/button';
import { IComment } from '@/types';
import { showToast } from '@/utils';

import styles from './comment.module.css';

export const Comment = ({ comment }: { comment: IComment }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [textComment, setTextComment] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const { user, commentAnswer } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const author = comment.author.username;
  const isActiveAnswer = comment.id === commentAnswer;

  useEffect(() => {
    if (user) setUsername(user);
    setTextComment(comment.content);
  }, [user]);

  const answerHandler = () => {
    dispatch(setCommentAnswer(isActiveAnswer ? null : comment.id));
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => setTextComment(e.target.value);

  const toggleMode = () => {
    setEditMode((mode) => !mode);
    setTextComment(comment.content);
  };

  const deleteCommentHandler = async () => {
    showToast({ message: 'Идет удаление...', thisError: false });

    const response = await deleteComment(comment.article, comment.id);
    if (response.status === 204) {
      router.refresh();
      showToast({ message: 'Комментарий удален', thisError: false });
    } else {
      const responseToken = await handleJWTRefresh();

      if (responseToken) {
        const responseSecond = await deleteComment(comment.article, comment.id);

        if (responseSecond.status === 204) {
          router.refresh();
          showToast({ message: 'Комментарий удален', thisError: false });
        }
      }
    }
  };

  const changeCommetHandler = async () => {
    showToast({ message: 'Изменение отправляется...', thisError: false });

    const response = await changeComment(comment.article, comment.id, { content: textComment });
    if (response) {
      setEditMode(false);
      showToast({ message: 'Комментарий изменен', thisError: false });
    } else {
      const responseToken = await handleJWTRefresh();

      if (responseToken) {
        const responseSecond = await changeComment(comment.article, comment.id, {
          content: textComment,
        });

        if (responseSecond) {
          setEditMode(false);
          showToast({ message: 'Комментарий изменен', thisError: false });
        }
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.comment}
        style={{ background: comment.id === commentAnswer ? '#444' : '#5f5f5f' }}
      >
        <h3 className={styles.title}>{comment.author.username}</h3>

        {editMode ? (
          <div className={styles.change}>
            <input
              className={styles.input}
              type="text"
              value={textComment}
              onChange={inputHandler}
            />
            <Button
              className={styles.btn}
              disabled={Boolean(textComment === comment.content || !textComment.length)}
              onClick={changeCommetHandler}
            >
              Отправить
            </Button>
          </div>
        ) : (
          <div className={styles.text}>{textComment}</div>
        )}

        <div className={styles.bottom}>
          {username && (
            <Button className={styles.answer} onClick={answerHandler}>
              {isActiveAnswer ? 'Отменить ответ' : 'Ответить'}
            </Button>
          )}
          {username === author && (
            <div className={styles.actions}>
              <Button className={styles.btn} onClick={toggleMode}>
                {editMode ? 'Отменить изменения' : 'Изменить'}
              </Button>
              <Button className={styles.btnDelete} onClick={deleteCommentHandler}>
                Удалить
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.children}>
        {!!comment.children.length &&
          comment.children.map((child) => <Comment key={child.id} comment={child} />)}
      </div>
    </div>
  );
};
