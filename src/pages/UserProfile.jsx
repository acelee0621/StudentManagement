import {
  Badge,
  Descriptions,
  Divider,
  Form,
  Button,
  Input,
  message,
} from "antd";
import { useSelector } from "react-redux";
import { useChangePasswordMutation } from "../store/api/authApi";

const UserProfile = () => {
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

  //用户状态的处理
  let status = "";
  let statusContent = "";
  if (auth.userInfo.confirmed) {
    status = "success";
    statusContent = "有效用户";
  } else {
    status = "error";
    statusContent = "已被禁用";
  }

  const items = [
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
    },
    {
      key: "4",
      label: "Account Created Date",
      children: accountCreatedTime,
    },
    {
      key: "5",
      label: "Status",
      children: <Badge status={status} text={statusContent} />,
    },
  ];

  // 密码修改功能
  const [changePasswordFn, { error }] = useChangePasswordMutation();
  const [form] = Form.useForm();  

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    // console.log("Received values of form: ", values);
    const currentPassword = values.currentPassword;
    const password = values.password;
    const passwordConfirmation = values.confirm;
    changePasswordFn({ currentPassword, password, passwordConfirmation }).then(
      (res) => {
        console.log("Received res: ", res);
        if (!error) {
          messageApi.open({
            type: "success",
            content: "密码修改成功！",
          });
        }
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Descriptions title="User Info" column={1} bordered items={items} />
      <Divider orientation="left">修改密码</Divider>
      {/* 密码修改功能 */}
      <Form
        labelCol={{ span: 8 }}
        form={form}
        name="changePassword"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          name="currentPassword"
          label="原密码"
          rules={[
            {
              required: true,
              message: "Please input your current password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="password"
          label="新密码"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 16, offset: 8 }}
          style={{ textAlign: "center" }}
        >
          <Button type="primary" htmlType="submit">
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserProfile;
