import { Dropdown } from "antd";
import { IdcardOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/reducer/authSlice";
import avatar from "../../assets/img/avatar001.png";

const dropdownMenuItems = [
  {
    key: "userProfile",
    icon:<IdcardOutlined />,
    label: <a href="/profile">用户信息</a>,
  },
  {
    key: "logout",
    icon:<LogoutOutlined />,
    label: <a href="/">Logout</a>,
  },
];

const DropdownMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //下拉菜单点击事件
  const onClick = ({ key }) => {
    // console.log(key);
    if (key === "logout") {
      dispatch(logout());
      // 跳转到登出页
      navigate("/");
    }
  };

  return (
    <Dropdown menu={{ items: dropdownMenuItems, onClick }}>
      <img
        src={avatar}
        style={{
          width: "45px",
          borderRadius: "100%",
          float: "right",
          marginRight: "30px",
          marginTop: "10px",
        }}
        alt="DropdownPic"
      />
    </Dropdown>
  );
};

export default DropdownMenu;
