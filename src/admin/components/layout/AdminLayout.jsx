import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <header>Header Admin</header>
      <Outlet/>
      <footer>Footer Admin</footer>
    </>
  );
};

export default AdminLayout;