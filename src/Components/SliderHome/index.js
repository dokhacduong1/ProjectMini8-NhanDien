import "./SliderHome.scss"
import {  Menu } from 'antd';
import { UserOutlined, ReconciliationOutlined,VideoCameraOutlined,FileDoneOutlined,HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";
function SliderHome(){
  const location =useLocation()

    function getItem(key,label, icon, children) {
        return {
          key,
          icon,
          label,
          children,
          
        };
      }
    const items = [
        getItem('/',<Link to="home">Trang Chủ</Link> , <HomeOutlined />),
        getItem('students',<span className="layout__slider-item">Sinh Viên</span>, <span className="layout__slider-item">< UserOutlined /></span>,[
          getItem('/add-students',<Link to="add-students">Thêm Sinh Viên</Link>,null),
          getItem('/student-management',<Link to="student-management">Quản Lý Sinh Viên</Link>,null)
        ]),
        getItem('courses',<span className="layout__slider-item">Khóa Học</span> , <span className="layout__slider-item"><ReconciliationOutlined /></span>,[
          getItem('/add-courses',<Link to="add-courses">Thêm Khóa Học</Link>,null),
          getItem('/courses-management',<Link to="courses-management">Quản Lý Khóa Học</Link>,null)
        ]),
      
        getItem('schedule',<span className="layout__slider-item">Lịch Học</span>, <span className="layout__slider-item"><FileDoneOutlined /></span>,[
          getItem('/add-schedule',<Link to="add-schedule">Thêm Lịch Học</Link>,null),
          getItem('/schedule-management',<Link to="schedule-management">Quản Lý Lịch Học</Link>,null)
        ]),
      
        getItem('face-recognition',<span className="layout__slider-item">Điểm Danh</span>, <span className="layout__slider-item"><VideoCameraOutlined /></span>,[
          getItem('/face-recognition',<Link to="face-recognition">Nhận Diện</Link>, null),
          getItem('/face-recognition-management',<Link to="face-recognition-management">Quản Lý Điểm Danh</Link>, null),
        ]),
        getItem('/statistical',<Link to="statistical">Thống Kê Điểm Danh</Link> , <HomeOutlined />),
      ];
    return(
        <>
             <Menu className="layout__slider-menu"
               
                defaultSelectedKeys={location.pathname}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
            />
        </>
    )
}
export default SliderHome