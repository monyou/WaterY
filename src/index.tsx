/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import Routing from "./pages/Routing.tsx";
import GlobalLoader from "./components/Loader.tsx";
import Toast from "./components/Toast.tsx";

const root = document.getElementById("root");

render(
    () => (
        <>
            <Routing />
            <GlobalLoader />
            <Toast />
        </>
    ),
    root!
);
