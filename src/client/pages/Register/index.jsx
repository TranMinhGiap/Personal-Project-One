import { Form, Input, Button, Typography, Card } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {

  const { Title } = Typography;

  const navigate = useNavigate();

  // call api
  const onFinish = (values) => {
    console.log("Register values:", values);
    navigate("/");
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card style={{ width: 450, padding: 20, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <Title level={3} style={{ textAlign: "center" }}>
            Đăng ký
          </Title>

          <Form name="register" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="username"
              label="Tên người dùng"
              rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên người dùng" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Xác nhận mật khẩu"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không trùng khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đăng ký
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Register;