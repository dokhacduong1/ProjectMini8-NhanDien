/* eslint-disable no-unused-vars */
import { Layout } from "antd";
import { Outlet  } from "react-router-dom";
import Header from "./Header";
import FooterMain from "./Footer";
import Sider from "antd/es/layout/Sider";

import { useEffect, useState } from "react";
import SliderHome from "../SliderHome";
import { getCookie } from "../../helpers/cookie";
import { useDispatch, useSelector } from "react-redux";

import {  authentication } from "../../Action/auth";


const {  Content } = Layout;
function LayoutMain() {
  const authenMain = useSelector((status) => status.authenticationReducer);
  const dispatch = useDispatch();
 

  const [collapsed,setCollapsed] = useState(false);
  const token = getCookie("token")
  useEffect(()=>{
    if(token){
      dispatch(authentication(true));
    }
  },[])
  return (
    <>
      <Layout>
        <Header className="layout__header" setCollapsed ={setCollapsed} collapsed ={collapsed}/>
        <Layout>
        {(token !=="") && (
            <>
              <Sider theme="light" className="layout__slider" collapsed={collapsed}>
                <SliderHome />
              </Sider>
            </>
          )}
          <Content className="layout__main">
            <Outlet />
          </Content> 
        </Layout>
        <FooterMain />
      </Layout>
    </>
  );
}
export default LayoutMain;
