import { Card, Button, Form, Input, message, Modal } from "antd";
import avatar from "../assets/img/avatar001.png";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRegisterMutation, useLoginMutation } from "../store/api/authApi";
import { useDispatch } from "react-redux";
import { login } from "../store/reducer/authSlice";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginFn, { error: loginError }] = useLoginMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  const navigate = useNavigate();  

  const onSubmitLogin = (values) => {
    // console.log("Received values of form: ", values);
    if (isLogin) {
      // console.log("Login", values.username, values.password);
      const username = values.username;
      const password = values.password;
      loginFn({ identifier: username, password }).then((res) => {
        // console.log(res);
        if (!res.error) {          
          dispatch(
            login({
              token: res.data.jwt,
              userInfo: res.data.user,
            })
          );
          navigate("/student_manage/student_list", { replace: true });
          messageApi.open({
            type: "success",
            content: "登陆成功！",
          });
        }
      });
    }
  };

  //处理注册业务
  const [regFn, { error: regError }] = useRegisterMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const showModal = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSubmitReg = (values) => {
    console.log("Received values of form: ", values);
    const username = values.username;
    const password = values.password;
    const email = values.email;
    regFn({ username, password, email }).then(() => {
      if (!regError) {
        setIsLogin(true);
        navigate("/login", { replace: true });
        messageApi.open({
          type: "success",
          content: "注册成功！",
        });
      }
    });
  };

  //处理错误信息
  useEffect(() => {
    if (isLogin && loginError) {
      messageApi.open({
        type: "error",
        content: loginError.data.error.message,
      });
    } else if (!isLogin && regError) {
      messageApi.open({
        type: "error",
        content: regError.data.error.message,
      });
    }
  }, [isLogin, loginError, regError, messageApi]);

  return (
    <div className="wrap_container">
      <div className="whiteBg"></div>
      <div className="login_wrapper">
        {contextHolder}
        <img
            src={avatar}
            alt="LOGO"
            style={{
              width: "20vh",
              display: "block",
              borderRadius: "50%",
              margin: "5vh auto",
            }}
          />
        <Card
          title="学生管理系统"
          bordered={true}
          style={{
            width: 400,
            margin: "0 auto",
            boxShadow: "20px 15px 15px -3px rgba(0,0,0,0.1)",
          }}
          styles={{ header: { textAlign: "center",fontSize:"1.1rem" } }}
        >
          <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 400 }}
            onFinish={onSubmitLogin}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Log in
              </Button>
              <a onClick={showModal}>Register now!</a>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Modal
        title="注册新用户："
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} name="register" onFinish={onSubmitReg}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="E-mail" />
          </Form.Item>
          <Form.Item
            name="password"
            hasFeedback
            rules={[
              { required: true, message: "Please input your Password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
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
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
