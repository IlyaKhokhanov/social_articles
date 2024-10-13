import { getToken } from '@/services/apiActions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppProp {
  user: string | null;
  commentAnswer: null | number;
  image: string | null;
}

const initialState: AppProp = {
  user: (getToken('access') && localStorage.getItem('user')) || null,
  commentAnswer: null,
  image: null,
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
    setImage(state, action: PayloadAction<string | null>) {
      state.image = action.payload;
    },
  },
});

export const { setUser, setCommentAnswer, setImage } = AppSlice.actions;

export default AppSlice.reducer;
