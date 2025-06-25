import { createSignal, onCleanup, onMount, Show } from "solid-js";
import GlobalLoader from "./components/Loader";
import Toast from "./components/Toast";
import Routing from "./pages/Routing";
import useSWUpdate from "./utils/useSWUpdate";

const App = () => {
    const [showUpdate, setShowUpdate] = createSignal(false);
    const { updateServiceWorker } = useSWUpdate();

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
                <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-3 rounded shadow">
                    New version available.
                    <button
                        class="ml-4 bg-white text-blue-600 px-3 py-1 rounded"
                        onClick={() => {
                            updateServiceWorker(true);
                        }}
                    >
                        Reload
                    </button>
                </div>
            </Show>
        </>
    );
};

export default App;
