import { useNavigate } from "@solidjs/router";
import AuthGuard from "../../components/AuthGuard";
import { supabase } from "../../utils/supabase";
import { addToast } from "../../utils/toast";
import { hideLoader, showLoader } from "../../utils/loader";

const AppPage = () => {
    const navigate = useNavigate();

    return (
        <AuthGuard>
            <div
                id="app-page"
                class="w-full h-dvh flex flex-col items-center justify-center"
            >
                <img src="/icon-512x512.png" alt="logo" class="-mt-15" />
                <section>
                    <h1 class="text-2xl">Dashboard</h1>
                    <button
                        class="mt-4 mx-auto block px-4 py-2 bg-primary hover:bg-secondary text-white rounded cursor-pointer"
                        onClick={async () => {
                            showLoader();
                            const { error } = await supabase.auth.signOut();
                            hideLoader();
                            if (error) {
                                addToast(error.message, "error");
                                return;
                            }
                            navigate("/");
                        }}
                    >
                        Sign Out
                    </button>
                </section>
            </div>
        </AuthGuard>
    );
};

export default AppPage;
