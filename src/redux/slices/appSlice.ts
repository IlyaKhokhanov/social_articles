import { getToken } from '@/services/apiActions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppProp {
  user: string | null;
  commentAnswer: null | number;
}

const initialState: AppProp = {
  user: (getToken('access') && localStorage.getItem('user')) || null,
  commentAnswer: null,
};

const AppSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<string | null>) {
      state.user = action.payload;
    },
    setCommentAnswer(state, action: PayloadAction<number | null>) {
      state.commentAnswer = action.payload;
    },
  },
});

export const { setUser, setCommentAnswer } = AppSlice.actions;

export default AppSlice.reducer;
