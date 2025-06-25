import { useNavigate } from "@solidjs/router";
import AuthGuard from "../../components/AuthGuard";

function urlBase64ToUint8Array(b64: string): Uint8Array {
    const padding = "=".repeat((4 - (b64.length % 4)) % 4);
    const base64 = (b64 + padding).replace(/\-/g, "+").replace(/_/g, "/");

    const rawData = globalThis.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const HomePage = () => {
    const navigate = useNavigate();

    const enableNotifications = async () => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            const reg = await navigator.serviceWorker.ready;
            const permission = await Notification.requestPermission();

            if (permission === "granted") {
                const subscription = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        "BFDdZ5NTvZHEjAiF6IPWtbngyU6n8oxCzpT1scc-soxKjwYQBJ38rMyQfXKbkyMKdwRdvxtTzW5PvFhjGMUNpxk"
                    ),
                });

                //TODO: Send subscription to your backend

                setTimeout(() => {
                    fetch(
                        `${import.meta.env
                            .VITE_SUPABASE_FUNCTIONS_URL!}/send-push`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${import.meta.env
                                    .VITE_SUPABASE_ANON_KEY!}`,
                            },
                            body: JSON.stringify({
                                subscription: subscription,
                                payload: {
                                    title: "Hydration Reminder",
                                    body: "Time to drink water!",
                                },
                            }),
                        }
                    );
                }, 5000);
            }
        }
    };

    return (
        <AuthGuard>
            <div
                id="home-page"
                class="w-full h-dvh flex flex-col items-center justify-center"
            >
                <img src="/icon-512x512.png" alt="logo" class="-mt-15" />
                <section>
                    <h1 class="text-2xl">Track your daily water intake!</h1>
                </section>
                <button
                    class="mt-20 px-4 py-2 bg-primary text-white rounded cursor-pointer hover:bg-secondary transition-colors"
                    onClick={enableNotifications}
                >
                    Notifications
                </button>
                <button
                    class="mt-4 px-4 py-2 bg-primary text-white rounded cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => navigate("/login")}
                >
                    Get Started
                </button>
            </div>
        </AuthGuard>
    );
};

export default HomePage;
