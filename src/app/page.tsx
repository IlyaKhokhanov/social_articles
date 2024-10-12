import { ListArticles } from '@/containers';
import { IArticle } from '@/types';

async function getServerSideProps(): Promise<IArticle[]> {
  const res = await fetch(`https://darkdes-django-t3b02.tw1.ru/api/v1/articles/`, {
    cache: 'no-cache',
  });
  return res.json();
}

const ArticlesPage = async () => {
  const data = await getServerSideProps();

  return <ListArticles data={data} />;
};

export default ArticlesPage;
