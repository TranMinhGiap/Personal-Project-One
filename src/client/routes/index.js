import ClientLayout from "../components/layout/ClientLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

const routesClient = [
  {
    path: "/",
    element: <ClientLayout/>,
    children: [
      {
        index: true,
        element: <Home/>
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
];

export default routesClient;