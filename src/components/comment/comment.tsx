'use client';

import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '../button/button';
import { IComment } from '@/types';

import styles from './comment.module.css';
import { commentManipulations, handleJWTRefresh, storeToken } from '@/services/apiActions';
import { setCommentAnswer } from '@/redux/slices/appSlice';

export const Comment = ({ comment }: { comment: IComment }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [textComment, setTextComment] = useState<string | null>(null);
  const { user, commentAnswer } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const author = comment.author.username;

  const isActiveAnswer = comment.id === commentAnswer;

  useEffect(() => {
    if (user) setUsername(user);
    if (username === author) setTextComment(comment.content);
  }, [user]);

  const answerHandler = () => {
    dispatch(setCommentAnswer(isActiveAnswer ? null : comment.id));
  };
  const changeCommentHandler = () => {
    const commentData = {
      content: textComment,
      parent: null,
    };

    commentManipulations('POST', articleId, commentData)
      .then((res) => {
        if (res.content && res.parent) {
          setInputValue('');
        } else {
          handleJWTRefresh().then((res) => {
            if (res.access) {
              storeToken(res.access, 'access');
              commentManipulations('POST', articleId, commentData);
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.comment}
        style={{ background: comment.id === commentAnswer ? '#444' : '#5f5f5f' }}
      >
        <div className={styles.commentBody}>
          <h3 className={styles.title}>{comment.author.username}</h3>
          <div className={styles.text}>{comment.content}</div>
          {username && (
            <Button className={styles.answer} onClick={answerHandler}>
              {isActiveAnswer ? 'Отменить ответ' : 'Ответить'}
            </Button>
          )}
        </div>
        {username === author && (
          <div className={styles.actions}>
            <Button className={styles.btn}>Изменить</Button>
            <Button className={styles.btnDelete}>Удалить</Button>
          </div>
        )}
      </div>

      <div className={styles.children}>
        {!!comment.children.length &&
          comment.children.map((child) => <Comment key={child.content} comment={child} />)}
      </div>
    </div>
  );
};
