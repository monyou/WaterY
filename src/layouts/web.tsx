import { children, type JSX } from "solid-js";

const WebLayout = (props: { children: JSX.Element }) => {
    const safeChildren = children(() => props.children);
    return (
        <div class="web-layout">
            <h1 class="text-center">Web Layout</h1>
            {safeChildren()}
        </div>
    );
};

export default WebLayout;
