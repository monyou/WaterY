import { children, type JSX } from "solid-js";

const MobileLayout = (props: { children: JSX.Element }) => {
    const safeChildren = children(() => props.children);
    return (
        <div class="mobile-layout">
            <h1 class="text-center">Mobile Layout</h1>
            {safeChildren()}
        </div>
    );
};

export default MobileLayout;
