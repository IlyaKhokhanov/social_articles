import { ArticleForm } from '@/components';
import { IArticle } from '@/types';

async function getServerSideProps(id: string): Promise<{ article: IArticle }> {
  const res = await fetch(`https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${id}`, {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }

  const data = (await res.json()) as IArticle;
  return { article: data };
}

const ArticleIdPage = async ({ params }: { params: { id: string } }) => {
  const { article } = await getServerSideProps(params.id);

  return <ArticleForm data={article} />;
};

export default ArticleIdPage;
