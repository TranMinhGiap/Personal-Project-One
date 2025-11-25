import { Layout, Input, Menu, Badge, Space, Flex } from "antd";
import {
  ShoppingCartOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import InfoUser from "../InfoUser";
import MenuBar from "../MenuBar";

import "./Header.scss";

const { Header } = Layout;
const { Search } = Input;

const menuItems = [
  { key: "home", label: "Trang chủ" },
  { key: "intro", label: "Giới thiệu" },
  { key: "iphone", label: "iPhone" },
  { key: "ipad", label: "iPad" },
  { key: "macbook", label: "Macbook - iMac" },
  { key: "applewatch", label: "Apple watch" },
  { key: "airpods", label: "Airpods" },
  { key: "accessories", label: "Phụ kiện" },
  { key: "policy", label: "Chính sách" },
  { key: "news", label: "Tin tức" },
  { key: "contact", label: "Liên hệ" },
];

const MainHeader = () => {
  return (
    <>
      {/* TOP BAR */}
      <header 
        style={{
          position: 'sticky',
          top: 0, 
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          padding: '5px 15px',
          // backdropFilter: 'blur(10px)', padding: '0 20px',
          // boxShadow: '0 2px 8px #f0f1f2',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <Flex align="center" justify="space-between"> 
          {/* Logo */}
          <Space>
            <Link style={{ display: 'flex', alignItems: 'center', gap: 8, color: "black" }} to="/">
              <div style={{ width: 50, aspectRatio: '1/1', borderRadius: "50%", border: '1px solid red', overflow: "hidden" }}>
                <img
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  src="https://cdn.vietnambiz.vn/171464876016439296/2020/7/16/image014-450x253-15948916770071198445387.png" alt="Brand"
                />
              </div>
              <p style={{ fontWeight: 600 }}>Brand</p>
            </Link>
          </Space>

          {/* Search */}
          <Space>
            <Search style={{ width: 500 }} placeholder="Tìm sản phẩm..." />
          </Space>

          {/* info */}
          <Space size={12}>
            {/* Hotline */}
            <Space>
              <PhoneOutlined />
              <span>1900 2138</span>
            </Space>
            {/* Thông tin tài khoản */}
            <InfoUser/>
            {/* Giỏ hàng */}
            <Space>
              <Badge count={2} size="small">
                <ShoppingCartOutlined />
              </Badge>
              <span>Giỏ hàng</span>
            </Space>
          </Space>
        </Flex>
      </header>

      {/* MENU BAR */}
      {/* <Header className="sp-menubar">
        <Menu
          mode="horizontal"
          items={menuItems}
          className="sp-menu"
          selectedKeys={["home"]}
        />
      </Header> */}
      <MenuBar/>
    </>
  );
};

export default MainHeader;
