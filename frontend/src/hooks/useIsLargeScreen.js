import { useEffect, useState } from "react";

export function useIsLargeScreen() {
    const [isLarge, setIsLarge] = useState(window.innerWidth >= 1024);
    useEffect(() => {
        const onResize = () => setIsLarge(window.innerWidth >= 1024);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return isLarge;
}