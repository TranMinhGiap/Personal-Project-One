import { Form, Input, Button, Typography, Card } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const { Title } = Typography;

  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Login values:", values);
    navigate("/admin"); 
  };

  return (
    <>
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
              <Button type="primary" htmlType="submit" block>
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