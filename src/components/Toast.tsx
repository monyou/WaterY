import { For } from "solid-js";
import { useToasts } from "../utils/toast";

const Toast = () => {
    const toasts = useToasts();

    return (
        <div class="fixed top-4 right-4 space-y-2 z-50">
            <For each={toasts()}>
                {(toast) => (
                    <div
                        class={`p-3 rounded shadow-md max-w-xs text-white ${
                            toast.type === "success"
                                ? "bg-green-500"
                                : toast.type === "error"
                                ? "bg-red-500"
                                : "bg-secondary"
                        }`}
                    >
                        {toast.message}
                    </div>
                )}
            </For>
        </div>
    );
};

export default Toast;
