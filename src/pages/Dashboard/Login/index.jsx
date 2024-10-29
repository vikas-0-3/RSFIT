import React, { useContext, useState } from "react";
import { Form, Input, Button, Typography, Alert, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import "./index.css";
import { userLogin } from "../../../services";
import { UserContext } from "../../../context/UserContext";

const { Title } = Typography;

const LoginPage = () => {
  const { userInfo, userRoleInfo, userLoggedInInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const [, setUser] = userInfo;
  const [, setUserRole] = userRoleInfo;
  const [, setUserLoggedIn] = userLoggedInInfo;
  const [errorMessage, setErrorMessage] = useState(null);

  const onFinish = (values) => {
    userLogin(values.email, values.password)
      .then((response) => {
        if (response.success) {
          setUser(response?.data?.user);
          setUserRole(response?.data?.user?.role);
          setUserLoggedIn(true);
          setErrorMessage(null);

          message.success("Login successful!");

          if (response?.data?.user?.role === "user") {
            navigate("/dashboard");
          } else if (response?.data?.user?.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            setErrorMessage("An unexpected error occurred. Please try again.");
          }
        } else {
          setErrorMessage(
            response.message || "Login failed! Please try again."
          );
        }
      })
      .catch((error) => {
        setErrorMessage(
          error.message || "An unexpected error occurred. Please try again."
        );
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="container">
      <div className="formContainer">
        <Title level={2} className="loginTitle">
          Login
        </Title>
        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input your email!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="submitButton">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;