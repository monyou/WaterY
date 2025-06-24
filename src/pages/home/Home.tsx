import { useNavigate } from "@solidjs/router";
import AuthGuard from "../../components/AuthGuard";

const HomePage = () => {
    const navigate = useNavigate();

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
                    onClick={() => navigate("/login")}
                >
                    Get Started
                </button>
            </div>
        </AuthGuard>
    );
};

export default HomePage;
