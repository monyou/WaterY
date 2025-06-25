import { createSignal, onCleanup, onMount, Show } from "solid-js";
import GlobalLoader from "./components/Loader";
import Toast from "./components/Toast";
import Routing from "./pages/Routing";

const App = () => {
    const [showUpdate, setShowUpdate] = createSignal(false);

    onMount(() => {
        const handler = () => setShowUpdate(true);
        window.addEventListener("sw-update", handler);

        onCleanup(() => {
            window.removeEventListener("sw-update", handler);
        });
    });

    return (
        <>
            <Routing />
            <GlobalLoader />
            <Toast />

            <Show when={showUpdate()}>
                <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-secondary w-[280px] text-white p-3 rounded shadow">
                    New version available.
                    <button
                        class="ml-4 bg-white text-primary px-3 py-1 rounded cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Reload
                    </button>
                </div>
            </Show>
        </>
    );
};

export default App;
