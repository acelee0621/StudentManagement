import { createBrowserRouter, Navigate } from "react-router-dom";
import ClassList from "../pages/ClassList";
import ClassType from "../pages/ClassType";
import CourseManage from "../pages/CourseManage";
import StudentList from "../pages/StudentList";
import StudentType from "../pages/StudentType";
import MyLayout from "../components/MyLayout";
import Login from "../pages/Login";
import Auth from "../components/Auth";
import UserProfile from "../pages/UserProfile";

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    // errorElement:<NotFound/>,
  },
  {
    path: "/",
    element: (
      <Auth>
        <MyLayout />
      </Auth>
    ),
    children: [
      {
        path: "/student_manage/student_type",
        element: <StudentType />,
      },
      {
        path: "/student_manage/student_list",
        element: <StudentList />,
      },
      {
        path: "/class_manage/class_type",
        element: <ClassType />,
      },
      {
        path: "/class_manage/class_list",
        element: <ClassList />,
      },
      {
        path: "/course_manage",
        element: <CourseManage />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
    ],
  },
  //嵌套路由结束---------------------------------------------------
  /* {
    path: "/login",
    element: <Login />,
  }, */
  {
    path: "*",
    element: <Navigate to="/" replace />,
    // errorElement:<NotFound/>,
  },
]);

export default routes;
