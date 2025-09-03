import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    loginRedirect: '/dashboard',
    token: '',
    userData: null,
    customerLogin:false,
  },
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setTempUserData: (state, action) => {
      state.tempUserData = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      // localStorage.setItem('react_template_token', action.payload)
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setLoginRedirect: (state, action) => {
      state.loginRedirect = action.payload;
    },
    setCustomerLogin: (state, action) => {
      state.customerLogin = action.payload;
    },
    setLogout: (state, action) => {
      state.isLogin = false;
      state.token = '';
      state.userData = null;
      state.customerLogin = false;
    }
  },
});

export const { setLogin, setLogout, setToken, setUserData, setTempUserData,setLoginRedirect,setCustomerLogin } = authSlice.actions;

export default authSlice.reducer;