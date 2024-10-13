'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ActionButtons, Button } from '@/components';
import { useAppSelector } from '@/redux/hooks';
import { IArticle } from '@/types';

import styles from './listArticles.module.css';

export const ListArticles = ({ data }: { data: IArticle[] }) => {
  const [username, setUsername] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.app);
  const router = useRouter();

  useEffect(() => {
    if (user) setUsername(user);
  }, [user]);

  const addArticleHandle = () => {
    router.push('/write');
  };

  return (
    <div className={styles.container}>
      {username && <ActionButtons editBtn={{ cb: addArticleHandle, text: 'Написать статью' }} />}
      <div className={styles.articles}>
        {data.map((el) => (
          <div className={styles.card} key={el.id}>
            <h2 className={styles.title}>{el.title}</h2>
            {el.image ? (
              <Image
                className={styles.img}
                src={`${el.image}`}
                alt="logo"
                unoptimized
                width={300}
                height={150}
                priority
              />
            ) : (
              <div className={styles.empty}>Картинка отсутствует</div>
            )}

            <div className={styles.text}>
              {el.content.substring(0, 50)}
              <Link href={`/${el.id}`}>
                <Button className={styles.readMore}>Читать далее</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
