import { createSignal } from 'solid-js';

const [loading, setLoading] = createSignal(false);

export const showLoader = () => {
    setLoading(true);
}

export const hideLoader = () => {
    setLoading(false);
}

export const useLoader = () => {
    return loading;
}
