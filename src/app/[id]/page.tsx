import { ArticleId } from '@/components';
import { IArticle, IComment } from '@/types';

type ArticleType = {
  article: IArticle;
  comments: IComment[];
};

async function getServerSideProps(id: string): Promise<ArticleType> {
  const [article, comments] = await Promise.all([
    fetch(`https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${id}`, {
      cache: 'no-cache',
    }).then((res) => res.json() as Promise<IArticle>),
    fetch(`https://darkdes-django-t3b02.tw1.ru/api/v1/articles/${id}/comments/`, {
      cache: 'no-cache',
    }).then((res) => res.json() as Promise<IComment[]>),
  ]);

  return { article, comments };
}

const ArticleIdPage = async ({ params }: { params: { id: string } }) => {
  const { article, comments } = await getServerSideProps(params.id);

  return <ArticleId article={article} comments={comments} />;
};

export default ArticleIdPage;
