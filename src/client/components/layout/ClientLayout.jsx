import { Outlet } from "react-router-dom";
import { Layout } from 'antd';
import MainHeader from "../common/HeaderComponent";
import FooterClient from "../common/FooterClient";
const { Content } = Layout;

const ClientLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MainHeader/>
      <Content style={{ padding: '0 20px' }}>
        <Outlet />
      </Content>
      <FooterClient/>
    </Layout>
  );
};

export default ClientLayout;