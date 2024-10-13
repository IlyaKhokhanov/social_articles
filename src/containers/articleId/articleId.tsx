'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { ActionButtons, Comment, WriterComment } from '@/components';
import { articleManipulations, handleJWTRefresh, storeToken } from '@/services/apiActions';
import { useAppSelector } from '@/redux/hooks';
import { IArticle, IComment } from '@/types';

import styles from './articleId.module.css';

export const ArticleId = ({ article, comments }: { article: IArticle; comments: IComment[] }) => {
  const [username, setUsername] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.app);
  const router = useRouter();

  const author = article.author.username;

  useEffect(() => {
    if (user) setUsername(user);
  }, [user]);

  const deleteArticleHandle = useCallback(() => {
    articleManipulations('DELETE', article.id)
      .then((res) => {
        if (res.ok) {
          router.replace('/');
          router.refresh();
        } else {
          handleJWTRefresh()
            .then((res) => {
              if (res.access) {
                storeToken(res.access, 'access');
                articleManipulations('DELETE', article.id)
                  .then((res) => {
                    if (res.ok) {
                      router.replace('/');
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
  }, []);

  const editArticleHandle = useCallback(() => {
    router.replace(`/${article.id}/edit`);
  }, []);

  return (
    <div className={styles.container}>
      {username === author && (
        <ActionButtons
          editBtn={{ cb: editArticleHandle, text: 'Редактировать статью' }}
          author={article.author?.username}
          deleteBtn={{ cb: deleteArticleHandle, text: 'Удалить статью' }}
        />
      )}
      <div className={styles.article}>
        {article.image && (
          <div className={styles.imgWrapper}>
            <Image
              className={styles.img}
              src={`${article.image}`}
              fill
              alt="Photo"
              unoptimized
              priority
            />
          </div>
        )}
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.text}>{article.content}</div>

        <h2 className={styles.title}>Комментарии</h2>
        <div className={styles.comments}>
          {!!comments.length &&
            comments.map((comment) => <Comment key={comment.id} comment={comment} />)}

          <WriterComment articleId={article.id} />
        </div>
      </div>
    </div>
  );
};
