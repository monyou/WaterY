import { Show } from "solid-js";
import { useLoader } from "../utils/loader";

const GlobalLoader = () => {
    const loading = useLoader();

    return (
        <Show when={loading()}>
            <div
                class="fixed inset-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[9999] cursor-wait"
                aria-live="polite"
                aria-busy="true"
            >
                <svg
                    class="animate-spin h-12 w-12 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
            </div>
        </Show>
    );
};

export default GlobalLoader;
