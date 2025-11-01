import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import ProductCategory from "../pages/ProductCategory";
import ProductCategoryList from "../pages/ProductCategory/list";
import CreateProductCategory from "../pages/ProductCategory/create";
import DetailProductCategory from "../pages/ProductCategory/detail";
import EditProductCategory from "../pages/ProductCategory/edit";
import Role from "../pages/Role";
import RoleList from "../pages/Role/list";
import CreateRole from "../pages/Role/create";
import RoleDetail from "../pages/Role/detail";
import EditRole from "../pages/Role/edit";
import RolePermissions from "../pages/Role/permissions";
import Account from "../pages/Account";
import AccountList from "../pages/Account/list";
import CreateAccount from "../pages/Account/create";
import EditAccount from "../pages/Account/edit";
import AccountDetail from "../pages/Account/detail";
import MyAccountEdit from "../pages/MyAccount/edit";

const routesAdmin = [
  {
    path: "/admin",
    element: <AdminLayout/>,
    children: [
      {
        index: true,
        element: <Dashboard/>
      },
      {
        path: "product-category",
        element: <ProductCategory/>,
        children: [
          {
            index: true,
            element: <ProductCategoryList/>
          },
          {
            path: "create",
            element: <CreateProductCategory/>
          },
          {
            path: "detail/:id",
            element: <DetailProductCategory/>
          },
          {
            path: "edit/:id",
            element: <EditProductCategory/>
          }
        ]
      },
      {
        path: "roles",
        element: <Role/>,
        children: [
          {
            index: true,
            element: <RoleList/>
          },
          {
            path: "create",
            element: <CreateRole/>
          },
          {
            path: "detail/:id",
            element: <RoleDetail/>
          },
          {
            path: "edit/:id",
            element: <EditRole/>
          },
          {
            path: "permissions",
            element: <RolePermissions/>
          }
        ]
      },
      {
        path: "accounts",
        element: <Account/>,
        children: [
          {
            index: true,
            element: <AccountList/>
          },
          {
            path: "create",
            element: <CreateAccount/>
          },
          {
            path: "edit/:id",
            element: <EditAccount/>
          },
          {
            path: "detail/:id",
            element: <AccountDetail/>
          }
        ]
      },
      {
        path: "my-accounts/edit",
        element: <MyAccountEdit/>
      }
    ]
  },
  {
    path: "/admin/login",
    element: <Login/>
  },
  {
    path: "/admin/register",
    element: <Login/>
  }
];

export default routesAdmin;