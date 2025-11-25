import { Dropdown, Space } from 'antd';
import { LoginOutlined, LogoutOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const InfoUser = (props) => {
  const { id, url, reload, api } = props;
  const navigate = useNavigate();

  const items = [
    {
      key: 'login',
      label: (
        <Space>
          <LoginOutlined />
          <span>Đăng nhập</span>
        </Space>
      ),
      onClick: () => {
        navigate(`/login`);
      },
    },
    {
      key: 'signup',
      label: (
        <Space>
          <LogoutOutlined />
          <span>Đăng ký</span>
        </Space>
      ),
      onClick: () => {
        navigate(`/register`);
      },
    },
    {
      key: 'account',
      label: (
        <Space>
          <InfoCircleOutlined />
          <span>Tài khoản</span>
        </Space>
      ),
      onClick: () => {
        navigate(`/account`);
      },
    }
  ]

  return (
    <>
      <Dropdown
        menu={{items}}
        // trigger={['click']}
        placement="bottomRight"
        overlayClassName="actions-dropdown" 
      >
        <Space style={{ cursor: "pointer" }}>
          <UserOutlined />
          <span>Tài khoản</span>
        </Space>
      </Dropdown>
    </>
  );
};

export default InfoUser;