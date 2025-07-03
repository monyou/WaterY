import { createStore } from "solid-js/store";
import {
    createContext,
    useContext,
    createEffect,
    children,
    type JSX,
} from "solid-js";

const StoreContext = createContext();

const LOCAL_KEY = "watery-app-store";
const initialState = { theme: "light" };

export const StoreProvider = (props: { children: JSX.Element }) => {
    const safeChildren = children(() => props.children);
    const saved = localStorage.getItem(LOCAL_KEY);

    const [state, setState] = createStore(
        saved ? JSON.parse(saved) : initialState
    );

    // Persist on change
    createEffect(() => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
    });

    return (
        <StoreContext.Provider value={[state, setState]}>
            {safeChildren()}
        </StoreContext.Provider>
    );
};

export const useAppStore = () => {
    return useContext(StoreContext);
};
