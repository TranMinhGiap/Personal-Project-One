import { Layout } from 'antd';
import './Header.scss';
import { Input } from 'antd';
import {
  MenuFoldOutlined, MenuUnfoldOutlined
} from '@ant-design/icons';
import { useState } from 'react';
//=================================
const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = (props) => {
  const { setCollapsed, collapsed } = props;
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    setLoading(true);
    console.log(e);
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }

  return (
    <Header className="header ">
      <div className='header__left'>
        <div className='header__collapsed' onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
        </div>
        <Search placeholder="Tìm kiếm" loading={loading} disabled={loading} enterButton onSearch={handleSearch} />
      </div>
    </Header>
  );
};

export default HeaderComponent;