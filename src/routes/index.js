import { Navigate } from "react-router-dom";
import LayoutMain from "../Components/Layout";
import Login from "../Pages/Login";

import PrivateRoutes from "../Components/PrivateRoutes";
import Home from "../Pages/Home";
import Register from "../Pages/Register";
import FaceRecognition from "../Pages/FaceRecognition";
import AddStudents from "../Pages/AddStudents";
import StudentManagement from "../Pages/StudentManagement";
import AddCourses from "../Pages/AddCourses";
import CoursesManagement from "../Pages/CoursesManagement";
import CoursesViews from "../Pages/CoursesViews";
import CoursesEdit from "../Pages/CoursesEdit";
import AddSchedule from "../Pages/AddSchedule";
import ScheduleManagement from "../Pages/ScheduleManagement";
import WebcamFaceRecognition from "../Components/WebcamFaceRecognition";
import FaceRecognitionManagement from "../Pages/FaceRecognitionManagement";
import AttendanceManagement from "../Pages/AttendanceManagement";

import Statistical from "../Pages/Statistical";

export const routes = [
  {
    path: "/",
    element: <LayoutMain />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "face-recognition",
            element: <FaceRecognition />,
          },
          {
            path: "face-recognition-start/:id",
            element: <WebcamFaceRecognition />,
          },
          {
            path:"face-recognition-management",
            element: <FaceRecognitionManagement/>
          },
          {
            path: "add-students",
            element: <AddStudents />,
          },
          {
            path: "student-management",
            element:<StudentManagement/>
          },
          {
            path: "add-courses",
            element:<AddCourses/>
          },
          {
            path: "courses-management",
            element:<CoursesManagement/>
          },
          {
            path: "courses-views/:id",
            element:<CoursesViews/>
          }
          ,
          {
            path: "courses-edit/:id",
            element:<CoursesEdit/>
          },
          {
            path: "add-schedule",
            element:<AddSchedule/>
          },
          {
            path: "schedule-management",
            element:<ScheduleManagement/>
          },
          {
            path:"attendance-management/:id",
            element:<AttendanceManagement/>
          },
          {
            path:"statistical",
            element:<Statistical/>
          }
        ],
      },
    ],
  },
];
