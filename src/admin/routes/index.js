import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import ProductCategory from "../pages/ProductCategory";
import ProductCategoryList from "../pages/ProductCategory/list";
import CreateProductCategory from "../pages/ProductCategory/create";
import DetailProductCategory from "../pages/ProductCategory/detail";

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
          }
        ]
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