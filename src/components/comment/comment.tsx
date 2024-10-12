'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

import { changeComment, deleteComment, handleJWTRefresh, storeToken } from '@/services/apiActions';
import { setCommentAnswer } from '@/redux/slices/appSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '../button/button';
import { IComment } from '@/types';

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

  const deleteCommentHandler = () => {
    deleteComment(comment.article, comment.id)
      .then((res) => {
        if (res.ok) {
          router.refresh();
        } else {
          handleJWTRefresh().then((res) => {
            if (res.access) {
              storeToken(res.access, 'access');
              deleteComment(comment.article, comment.id).then((res) => {
                if (res.ok) router.refresh();
              });
            }
          });
        }
      })
      .catch((err) => console.error(err));
  };

  const changeCommetHandler = () => {
    changeComment(comment.article, comment.id, { content: textComment })
      .then((res) => {
        if (res.content) {
          setEditMode(false);
        } else {
          handleJWTRefresh().then((res) => {
            if (res.access) {
              storeToken(res.access, 'access');
              changeComment(comment.article, comment.id, { content: textComment }).then((res) => {
                if (res.content) setEditMode(false);
              });
            }
          });
        }
      })
      .catch((err) => console.error(err));
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
