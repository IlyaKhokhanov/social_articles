import { ListArticles } from '@/components';
import { IArticle } from '@/types';

async function getServerSideProps(): Promise<{ list: IArticle[] }> {
  const res = await fetch(`https://darkdes-django-t3b02.tw1.ru/api/v1/articles/`, {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }

  const data = (await res.json()) as IArticle[];
  return { list: data };
}

const ArticlesPage = async () => {
  const { list } = await getServerSideProps();

  return <ListArticles data={list} />;
};

export default ArticlesPage;
