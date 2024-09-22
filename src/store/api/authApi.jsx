import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    prepareHeaders:(headers,{getState})=>{
        //获取用户的token
        const token=getState().auth.token
        if(token){
             headers.set("Authorization",`Bearer ${token}`)
        }
        return headers;
    }//用来统一设置请求头
  }),
  endpoints(build) {
    return {
      register: build.mutation({
        query(user) {
          return {
            url: "auth/local/register",
            method: "POST",
            body: user, //username, password, email
          };
        },
      }),
      login: build.mutation({
        query(user) {
          return {
            url: "auth/local/",
            method: "POST",
            body: user, //identifier
          };
        },
      }),
      changePassword: build.mutation({
        query(user) {
          return {
            url: "auth/change-password",
            method: "POST",            
            body: user, //email
          };
        },
      }),
    };
  },
});

export default authApi;
export const {
  useRegisterMutation,
  useLoginMutation,
  useChangePasswordMutation,
} = authApi;
