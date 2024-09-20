import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authApi from "./api/authApi";
import studentApi from "./api/studentApi";
import authSlice from "./reducer/authSlice";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,studentApi.middleware), // Add the API middleware
});

setupListeners(store.dispatch);

export default store;
