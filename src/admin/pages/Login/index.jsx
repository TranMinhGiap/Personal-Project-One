import { Form, Input, Button, Typography, Card, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../features/auth/authSlice";
import { POST } from "../../../utils/requests";
import { useState } from "react";
import Cookies from 'js-cookie';

const Login = () => {

  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();
  
  const [loading, setLoading] = useState(false);

  const { Title } = Typography;

  const navigate = useNavigate();

  const token = Cookies.get('tokenAdmin');

  if(token){
    return <Navigate to="/admin" replace />;
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await POST("/api/v1/admin/auth/login", values);
      dispatch(setAuth(result));
      navigate("/admin");
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card style={{ width: 450, padding: 20, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <Title level={3} style={{ textAlign: "center" }}>
            Đăng nhập
          </Title>

          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
                Đăng nhập
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              Chưa có tài khoản?
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Login;