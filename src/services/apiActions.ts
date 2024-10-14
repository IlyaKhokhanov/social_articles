import axios from 'axios';
import Cookies from 'js-cookie';

import type { IAddArticle, IChangePassword, ISignin, ISignup, ITokens } from '@/types';

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

const instance = axios.create({ baseURL: 'https://darkdes-django-t3b02.tw1.ru/api/v1/' });

const registration = async (data: ISignup) => {
  return await instance
    .post(`registration/`, data, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }: { data: { user?: string } }) => data)
    .then((res) => (res?.user ? true : false))
    .catch((error) => console.log(error));
};

const login = async (data: ISignin) => {
  return await instance
    .post(`token/`, data, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }: { data: ITokens }) => data)
    .then((res) => {
      if (res?.refresh && res?.access) {
        storeToken(res.refresh, 'refresh');
        storeToken(res.access, 'access');
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => console.log(error));
};

const handleJWTRefresh = async () => {
  const refreshToken = getToken('refresh');
  return await instance
    .post(
      `token/refresh/`,
      { refresh: refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(({ data }: { data: { access?: string } }) => data)
    .then((res) => {
      if (res.access) {
        storeToken(res.access, 'access');
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => console.log(error));
};

const changePassword = async (data: IChangePassword): Promise<boolean | 'refresh' | void> => {
  return await instance
    .put(`change-password/`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken('access')}`,
      },
    })
    .then(({ data }: { data: { Success?: boolean; detail?: string } }) => data)
    .then((res) => {
      if (res?.Success) {
        return true;
      } else if (res?.detail) {
        return 'refresh';
      } else {
        return false;
      }
    })
    .catch((error) => console.log(error));
};

const addArticle = async (data: IAddArticle) => {
  const form_data = new FormData();
  if (data.image) form_data.append('image', data.image, data.image.name);
  form_data.append('title', data.title);
  form_data.append('content', data.content);

  return await instance
    .post(`articles/`, form_data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getToken('access')}`,
      },
    })
    .then(({ data }: { data: { title?: string; content?: string } }) =>
      data?.title && data?.content ? true : false
    )
    .catch((error) => console.log(error));
};

const changeArticle = async (data: IAddArticle, id: number) => {
  const form_data = new FormData();
  if (data.image) form_data.append('image', data.image, data.image.name);
  form_data.append('title', data.title);
  form_data.append('content', data.content);

  return await instance
    .patch(`articles/${id}/`, form_data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getToken('access')}`,
      },
    })
    .then(({ data }: { data: { title?: string; content?: string } }) =>
      data?.title && data?.content ? true : false
    )
    .catch((error) => console.log(error));
};

const deleteArticle = async (id: number) => {
  return await instance.delete(`articles/${id}/`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken('access')}` },
  });
};

const addComment = async (articleid: number, data: { content: string; parent?: number | null }) => {
  return await instance
    .post(`articles/${articleid}/comments/`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken('access')}`,
      },
    })
    .then(({ data }: { data: { content?: string } }) => (data?.content ? true : false))
    .catch((error) => console.log(error));
};

const changeComment = async (articleid: number, commentId: number, data: { content: string }) => {
  return await instance
    .put(`articles/${articleid}/comments/${commentId}/`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken('access')}`,
      },
    })
    .then(({ data }: { data: { content?: string } }) => (data?.content ? true : false))
    .catch((error) => console.log(error));
};

const deleteComment = async (articleid: number, commentId: number) => {
  return await instance.delete(`articles/${articleid}/comments/${commentId}/`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken('access')}` },
  });
};

export {
  getToken,
  removeTokens,
  registration,
  login,
  handleJWTRefresh,
  changePassword,
  addArticle,
  changeArticle,
  deleteArticle,
  addComment,
  changeComment,
  deleteComment,
};
