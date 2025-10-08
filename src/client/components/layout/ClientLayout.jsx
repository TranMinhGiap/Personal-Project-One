import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <>
      <header>Layout Header Client</header>
      <Outlet/>
      <footer>Layout Footer Client</footer>
    </>
  );
};

export default ClientLayout;