import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  UserOutlined,
  TeamOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Breadcrumb } from "antd";
import avatar from "../assets/img/avatar001.png";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DropdownMenu from "../components/MyLayout/DropdownMenu";

const { Header, Sider, Content } = Layout;



const sideBarMenuItems = [
  {
    key: "/student_manage",
    icon: <UserOutlined />,
    label: "学生管理",
    children: [
      {
        key: "/student_manage/student_type",
        label: "学生分类",
      },
      {
        key: "/student_manage/student_list",
        label: "学生列表",
      },
    ],
  },
  {
    key: "/class_manage",
    icon: <TeamOutlined />,
    label: "班级管理",
    children: [
      {
        key: "/class_manage/class_type",
        label: "班级分类",
      },
      {
        key: "/class_manage/class_list",
        label: "班级列表",
      },
    ],
  },
  {
    key: "/course_manage",
    icon: <ReadOutlined />,
    label: "课程管理",
  },
  {
    key: "/profile",
    icon: <IdcardOutlined />,
    label: "用户信息",
  },
];

//生成面包屑导航数据
const createBreadcrumbNavItemFn = (key) => {
  let arrObj = [];
  const tempRecursionFn = (arr) => {
    arr.forEach((items) => {
      const { children, ...info } = items;
      arrObj.push(info);
      if (items.children) {
        tempRecursionFn(children);
      }
    });
  };
  tempRecursionFn(sideBarMenuItems);
  //过滤数据
  const temp = arrObj.filter((item) => key.includes(item.key));
  if (temp.length > 0) {
    return [{ label: "首页", key: "/student_manage/student_type" }, ...temp];
  } else {
    return [];
  }
};

//MARK:下拉菜单的折叠及默认选中
const searchUrlKey = (key) => {
  const tempArray = [];
  const tempRecursionFn = (_arr) => {
    _arr.forEach((item) => {
      if (key.includes(item.key)) {
        tempArray.push(item.key);
        //判断当前节点有没有子节点
        if (item.children) {
          tempRecursionFn(item.children);
        }
      }
    });
  };
  tempRecursionFn(sideBarMenuItems);
  return tempArray;
};

const MyLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  
  //处理用户信息的显示
  const { pathname } = useLocation();
  const demoItemsArr = searchUrlKey(pathname);

  //MARK: 面包屑导航条
  const [nav_url, setNav_url] = useState([]);

  //MARK: 面包屑导航的回调、监听 createNavFn
  useEffect(() => {
    // console.log(pathname);
    setNav_url(createBreadcrumbNavItemFn(pathname));
  }, [pathname]);

  //面包屑导航数据
  const breadcrumbItems = nav_url.map((item) => {
    return {
      href: item.key,
      title: item.label,
    };
  });

  const menuClick = (event) => {    
    navigate(event.key);
  };

  //MARK:设置展开项的初始值
  const [openKeys, setOpenKeys] = useState(demoItemsArr);
  const handleOpenChange = (itemKeys) => {
    //itemKeys记录了当前展开的菜单
    // console.log("onOpenChange", itemKeys);    
    setOpenKeys([itemKeys[itemKeys.length - 1]]);
  };

  return (    
      <Layout style={{ width: "100vw", height: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logoAvatar">
            <img
              style={{
                display: "block",
                width: "50%",
                borderRadius: "15px",
                margin: "20px auto",
              }}
              src={avatar}
              alt="avatar"
            />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={demoItemsArr}
            onClick={menuClick}
            items={sideBarMenuItems}            
            onOpenChange={handleOpenChange}            
            openKeys={openKeys}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <span style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>
              学生管理系统
            </span>
            <DropdownMenu/>            
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Breadcrumb
              style={{ margin: "0 0 20px 0" }}
              items={breadcrumbItems}
            />
            <Outlet />
          </Content>
        </Layout>
      </Layout>   
  );
};

export default MyLayout;
