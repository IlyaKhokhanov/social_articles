'use client';

import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import app from './slices/appSlice';

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  app,
});

const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export const store = setupStore();
