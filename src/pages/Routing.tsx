import { createSignal, lazy, onMount } from "solid-js";
import { Route, Router } from "@solidjs/router";
import MobileLayout from "../layouts/mobile";
import WebLayout from "../layouts/web";

const Home = lazy(() => import("./home/Home"));
const Login = lazy(() => import("./login/Login"));
const Dashboard = lazy(() => import("./dashboard/Dashboard"));

const Routing = () => {
    const [isMobile, setIsMobile] = createSignal(false);

    const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    onMount(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
    });

    const mainAppPages = (
        <>
            <Route path={"/"} component={Dashboard} />
        </>
    );

    return (
        <Router>
            <Route path={"/"} component={Home} />
            <Route path={"/login"} component={Login} />
            {isMobile() ? (
                <Route path={"/app"} component={MobileLayout as any}>
                    {mainAppPages}
                </Route>
            ) : (
                <Route path={"/app"} component={WebLayout as any}>
                    {mainAppPages}
                </Route>
            )}
        </Router>
    );
};

export default Routing;
