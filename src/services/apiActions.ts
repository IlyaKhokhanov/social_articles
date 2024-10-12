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


export {
  login,
  handleJWTRefresh,
  registration,
  storeToken,
  getToken,
  removeTokens,
};
