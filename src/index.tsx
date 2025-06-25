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

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => {
            console.log("[App] Custom SW registered:", reg);
        })
        .catch((err) => {
            console.error("[App] SW registration failed:", err);
        });
}
