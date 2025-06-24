import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { z } from "zod";
import { supabase } from "../../utils/supabase";
import AuthGuard from "../../components/AuthGuard";
import { createSignal } from "solid-js";
import { addToast } from "../../utils/toast";
import { hideLoader, showLoader } from "../../utils/loader";

const loginSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .email("Invalid email address"),
    password: z
        .string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters long"),
});

const LoginPage = () => {
    const navigate = useNavigate();
    const [formSubmitted, setFormSubmitted] = createSignal(false);
    const [loginFormStore, setLoginFormStore] = createStore({
        email: {
            value: "",
            error: "",
        },
        password: {
            value: "",
            error: "",
        },
    });

    const validateLoginForm = (keys?: (keyof typeof loginFormStore)[]) => {
        const { success, error } = loginSchema.safeParse({
            email: loginFormStore.email.value,
            password: loginFormStore.password.value,
        });

        for (const key of keys || Object.keys(loginFormStore)) {
            const errMsg =
                error?.issues.find((i) => i.path.includes(key))?.message || "";
            setLoginFormStore(
                key as keyof typeof loginFormStore,
                "error",
                errMsg
            );
        }

        return success;
    };

    const handleLoginSubmit = async (event: any) => {
        event.preventDefault();
        setFormSubmitted(true);

        const ok = validateLoginForm();

        if (!ok) return;

        showLoader();
        const response = await supabase.auth.signInWithPassword({
            email: loginFormStore.email.value,
            password: loginFormStore.password.value,
        });
        hideLoader();

        if (!response.error) {
            navigate("/app");
        } else {
            addToast(response.error.message, "error");
        }
    };

    return (
        <AuthGuard>
            <div
                id="login-page"
                class="w-full h-dvh flex flex-col items-center justify-center"
            >
                <img src="/icon-192x192.png" alt="logo" />
                <section>
                    <h1 class="text-2xl">Welcome!</h1>
                    <p class="text-lg mt-2">
                        Please log in to continue using the app.
                    </p>
                </section>
                <form
                    id="login-form"
                    class="mt-10 w-85"
                    onSubmit={handleLoginSubmit}
                    noValidate
                >
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        class="border rounded p-2 w-full"
                        classList={{
                            "border-red-500": !!loginFormStore.email.error,
                        }}
                        value={loginFormStore.email.value}
                        onInput={(e) => {
                            setLoginFormStore(
                                "email",
                                "value",
                                e.currentTarget.value
                            );
                            if (formSubmitted()) validateLoginForm(["email"]);
                        }}
                    />
                    {loginFormStore.email.error && (
                        <span class="text-red-500 text-sm mt-1 pl-2">
                            {loginFormStore.email.error}
                        </span>
                    )}
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        class="border rounded p-2 w-full mt-2"
                        classList={{
                            "border-red-500": !!loginFormStore.password.error,
                        }}
                        value={loginFormStore.password.value}
                        onInput={(e) => {
                            setLoginFormStore(
                                "password",
                                "value",
                                e.currentTarget.value
                            );
                            if (formSubmitted())
                                validateLoginForm(["password"]);
                        }}
                    />
                    {loginFormStore.password.error && (
                        <span class="text-red-500 text-sm mt-1 pl-2">
                            {loginFormStore.password.error}
                        </span>
                    )}
                    <button
                        type="submit"
                        class="block mt-10 mx-auto px-4 py-2 bg-primary text-white rounded cursor-pointer hover:bg-secondary transition-colors"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </AuthGuard>
    );
};

export default LoginPage;
