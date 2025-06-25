/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App.tsx";

const root = document.getElementById("root");

render(App, root!);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
            console.log("[App] Custom SW registered ;)");
            registration.onupdatefound = () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.onstatechange = () => {
                        if (
                            newWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            // A new version is available
                            window.dispatchEvent(new Event("sw-update"));
                        }
                    };
                }
            };
        })
        .catch((err) => {
            console.error("[App] SW registration failed:", err);
        });
}
