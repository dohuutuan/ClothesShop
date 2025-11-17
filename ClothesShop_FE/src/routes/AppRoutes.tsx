import { useRoutes } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
import Home from "../pages/Home/Home";
import ActivateAccount from "../pages/activateAccount/ActivateAccount";
import ReactiveAccount from "../pages/activateAccount/ReactiveAccount";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import NotFound from "../pages/Error/NotFound";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import UserCart from "../pages/Cart/UserCart";
import SearchProduct from "../pages/SearchProduct/SearchProduct";
import ProductByCate from "../pages/ProductByCate/ProductByCate";

export default function AppRoutes() {
    const routes = [
        {
            path: "/",
            element: <ClientLayout />,
            children: [
                {
                    path: "",
                    element: <Home />,
                },
                {
                    path: "reset-password",
                    element: <ForgotPassword />,
                },
                {
                    path: "product/:id",
                    element: <ProductDetail />,
                },
                {
                    path:"cart",
                    element: <UserCart/>
                },
                {
                    path:"search",
                    element: <SearchProduct/>
                },
                {
                    path: "category/:slug",
                    element: <ProductByCate />
                }

            ]
        },
        
        {
            path: "/account/activate",
            element: <ActivateAccount />,
        },
        {
            path: "/account/re-activate",
            element: <ReactiveAccount />,
        },
        {
            path: "*",
            element: <NotFound/>,
        }
    ];

    return useRoutes(routes);
}
