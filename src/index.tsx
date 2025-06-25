/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App.tsx";

const root = document.getElementById("root");

render(App, root!);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => {
            console.log("[App] Custom SW registered ;)");
        })
        .catch((err) => {
            console.error("[App] SW registration failed:", err);
        });
}
