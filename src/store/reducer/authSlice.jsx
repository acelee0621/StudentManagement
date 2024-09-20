import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: () => {
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!token) {
      return {
        isLoggedIn: false,
        token: null,  //服务器发来的token默认有效期为一个月
        userInfo: null,
        expirationTime: 0  //登录状态失效时间
      };
    }
    return {
      isLoggedIn: true,
      token: token,
      userInfo: userInfo,
      expirationTime: +localStorage.getItem("expirationTime")
    };
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      //获取当前的时间戳
      const currentTime = Date.now();
      //设置登录状态的维持时间
      state.expirationTime = currentTime + 1000 * 60 * 60 * 24 * 7; // 设置失效日期，7 days 

      //将数据存储到本地存储中
      localStorage.setItem("token", state.token);
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      localStorage.setItem("expirationTime",state.expirationTime + "");
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.userInfo = null;

      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
