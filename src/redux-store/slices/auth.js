import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bearerToken: '', // Initial bearer token
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setBearerToken(state, action) {
      state.bearerToken = action.payload;
    },
    clearBearerToken(state) {
      state.bearerToken = ''; // Clear token on logout or error
    },
  },
});

export const { setBearerToken, clearBearerToken } = authSlice.actions;
export default authSlice.reducer;
