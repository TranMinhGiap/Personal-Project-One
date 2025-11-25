import { Menu } from "antd";
import { Link } from "react-router-dom";
import "./MenuBar.scss";

const menuItems = [
  { key: "home", label: <Link to="/">Trang chủ</Link> },
  { key: "intro", label: <Link to="/introduce">Giới thiệu</Link> },
  { key: "phone", label: <Link to="/phone">Điện thoại</Link> },
  { key: "accessories", label: <Link to="/accessories">Phụ kiện</Link> },
  { key: "policy", label: <Link to="/policy">Chính sách</Link> },
  { key: "news", label: <Link to="/news">Tin tức</Link> },
  { key: "contact", label: <Link to="/contact">Liên hệ</Link> },
];

const MenuBar = () => {
  return (
    <div className="menu-wrapper">
      <Menu
        mode="horizontal"
        items={menuItems}
        className="menu-client"
        selectedKeys={["home"]}
      />
    </div>
  );
};

export default MenuBar;
