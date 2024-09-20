import { useState } from "react";
import { useSelector } from "react-redux";
import { Badge, Modal, Descriptions } from 'antd';


const ProfileModal = () => {

    //用户信息的弹出框处理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //获取用户信息备用
  const auth = useSelector((state) => state.auth);
  // console.log(auth);

  // 格式化创建时间
  function formatDate(dateString, format = "yyyy-MM-dd HH:mm:ss") {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = format
      .replace(/yyyy/g, year)
      .replace(/MM/g, month)
      .replace(/dd/g, day)
      .replace(/HH/g, hour)
      .replace(/mm/g, minute)
      .replace(/ss/g, second);
    return formattedDate;
  }

  const accountCreatedTime = formatDate(
    auth.userInfo.createdAt,
    "yyyy年MM月dd日HH时mm分ss秒"
  );

  const userProfileItems = [
    {
      key: "1",
      label: "UserID",
      children: auth.userInfo.id,
    },
    {
      key: "2",
      label: "UserName",
      children: auth.userInfo.username,
    },
    {
      key: "3",
      label: "E-mail Address",
      children: auth.userInfo.email,
      span: 2,
    },
    {
      key: "4",
      label: "Account Created Date",
      children: accountCreatedTime,
      span: 2,
    },
    {
      key: "5",
      label: "Status",
      children: <Badge status="success" text="已登录" />,
    },
  ];

  return (
    <Modal
        // title="Basic Modal"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Descriptions
          title="用户信息"
          column={2}
          bordered
          items={userProfileItems}
        />
      </Modal>
      
  )
  
}


export default ProfileModal