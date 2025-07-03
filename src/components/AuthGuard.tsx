import { children, createSignal, onMount, type JSX } from "solid-js";
import { supabase } from "../utils/supabase";
import { useLocation, useNavigate } from "@solidjs/router";

const AuthGuard = (props: { children: JSX.Element }) => {
    const safeChildren = children(() => props.children);
    const navigate = useNavigate();
    const location = useLocation();
    const [showPage, setShowPage] = createSignal(false);

    onMount(async () => {
        const { data } = await supabase.auth.getSession();

        if (
            !data?.session &&
            location.pathname !== "/login" &&
            location.pathname !== "/"
        ) {
            navigate("/login");
            return;
        }

        if (
            data?.session &&
            (location.pathname === "/login" || location.pathname === "/")
        ) {
            navigate("/app");
            return;
        }

        setShowPage(true);
    });

    return <>{showPage() ? safeChildren() : null}</>;
};

export default AuthGuard;
