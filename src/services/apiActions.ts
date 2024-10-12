import Cookies from 'js-cookie';
import { IAddArticle, IChangePassword, ISignin, ISignup, ITokens } from '@/types';

const url = 'https://darkdes-django-t3b02.tw1.ru/api/v1/';

const storeToken = (token: string, type: 'access' | 'refresh') => {
  Cookies.set(type + 'Token', token);
};

const getToken = (type: string) => {
  return Cookies.get(type + 'Token');
};

const removeTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

const registration = async (data: ISignup) => {
  return fetch(`${url}registration/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

const login = async (data: ISignin): Promise<ITokens> => {
  return fetch(`${url}token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

const handleJWTRefresh = async () => {
  const refreshToken = getToken('refresh');
  return fetch(`${url}token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  }).then((res) => res.json());
};

const changePassword = async (data: IChangePassword) => {
  const accessToken = getToken('access');
  return fetch(`${url}change-password/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

const articleManipulations = async (method: string, id?: number | string, data?: IAddArticle) => {
  const accessToken = getToken('access');
  return fetch(`${url}articles/${id + '/' || ''}`, {
    method,
    headers: {
      // 'Content-Type': 'application/json',
      // 'Content-Type': 'multipart/form-data',
      // 'Content-Type': 'multipart/form-data; boundary="----WebKitFormBoundary7MA4YWxkTrZu0gW"',
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : '',
  });
};

const addComment = async (articleid: number, data: { content: string; parent?: number | null }) => {
  const accessToken = getToken('access');
  return fetch(`${url}articles/${articleid}/comments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : '',
  }).then((res) => res.json());
};

const deleteComment = async (articleid: number, commentId: number) => {
  const accessToken = getToken('access');
  return fetch(`${url}articles/${articleid}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const changeComment = async (articleid: number, commentId: number, data: { content: string }) => {
  const accessToken = getToken('access');
  return fetch(`${url}articles/${articleid}/comments/${commentId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export {
  getToken,
  storeToken,
  removeTokens,
  registration,
  login,
  handleJWTRefresh,
  changePassword,
  articleManipulations,
  addComment,
  deleteComment,
  changeComment,
};
