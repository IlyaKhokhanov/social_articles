export interface IArticle {
  content: string;
  id: number;
  image: string;
  title: string;
  author: IAuthor;
}

export interface IAddArticle {
  content: string;
  title: string;
  image?: string | null;
}

export interface IAuthor {
  id: number;
  username: string;
  email: string;
}

export interface IComment {
  article: number;
  author: IAuthor;
  children: IComment[];
  content: string;
  id: number;
}

export interface ISignup {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  username: string;
}

export interface ISignin {
  password: string;
  username: string;
}

export interface IChangePassword {
  old_password: string;
  password: string;
  confirmed_password: string;
}

export interface ITokens {
  refresh: string;
  access: string;
}

export interface IErrorLogin {
  detail: string;
}
