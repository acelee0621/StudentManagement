import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//createApi()用来创建RTKQ中的API对象
//RTKQ中所有的核心功能都通过该对象完成
//需要配置对象作为参数
const studentApi = createApi({
  reducerPath: "studentApi", // Api的标识，不能和其他的Api或reducer重复
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:1337/api/",
    prepareHeaders: (headers, { getState }) => {
      //获取用户的token
      const token = getState().auth.token;
      if (token) {
        // 统一设置请求头
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }), // 指定查询的基础信息，发送请求使用的工具
  tagTypes: ["student"], //用来指定Api中的标签类型
  endpoints(build) {
    // build是请求的构建器，通过build来设置请求的相关信息
    return {
      getStudents: build.query({
        query() {
          // 用来指定请求子路径
          return {
            url: "students",
          };
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        providesTags: [{ type: "student", id: "LIST" }],
      }),
      getStudentById: build.query({
        query(id) {
          return `students/${id}`;
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        keepUnusedDataFor: 60, //设置数据缓存的时间，单位是秒，默认值60
        providesTags: (result, error, id) => [{ type: "student", id }],
      }),
      delStudent: build.mutation({
        query(id) {
          return {
            url: `students/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["student"],
      }),
      addStudent: build.mutation({
        query(student) {
          return {
            url: "students",
            method: "POST",
            body: { data: student },
          };
        },
        invalidatesTags: [{ type: "student", id: "LIST" }],
      }),
      updateStudent: build.mutation({
        query(student) {
          return {
            url: `students/${student.key}`,
            method: "PUT",
            body: {
              data: {
                name: student.name,
                age: student.age,
                gender: student.gender,
                address: student.address,
              },
            },
          };
        },
        invalidatesTags: (result, error, student) => [
          { type: "student", id: student.id },
          { type: "student", id: "LIST" },
        ],
      }),
    };
  }, // endpoints 用来指定Api中的各种功能，是一个方法，需要一个对象作为返回值
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useDelStudentMutation,
  useAddStudentMutation,
  useUpdateStudentMutation,
} = studentApi;
export default studentApi;
