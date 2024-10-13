import { ArticleId } from '@/components';
import { IArticle, IComment } from '@/types';

type ArticleType = {
  article: IArticle;
  comments: IComment[];
};

async function getServerSideProps(id: string): Promise<ArticleType> {
  const [resArticle, resComments] = await Promise.all([
    fetch(`https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${id}`, {
      cache: 'no-cache',
    }),
    fetch(`https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${id}/comments/`, {
      cache: 'no-cache',
    }),
  ]);
  const [article, comments] = await Promise.all([resArticle.json(), resComments.json()]);

  return { article, comments };
}

const ArticleIdPage = async ({ params }: { params: { id: string } }) => {
  const { article, comments } = await getServerSideProps(params.id);

  return <ArticleId article={article} comments={comments} />;
};

export default ArticleIdPage;
