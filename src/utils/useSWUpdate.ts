import { registerSW } from "virtual:pwa-register";

const useSWUpdate = () => {
    const update = registerSW({
        onNeedRefresh() {
            window.dispatchEvent(new Event("sw-update"));
        },
        onOfflineReady() {
            console.log("App is ready to work offline");
        },
    });

    return update;
};

export default useSWUpdate;