import { useEffect, useState } from "react"

const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
    "3xl": 1920
}

const useTailwindBreakpoint = () => {
    const [currentBreakpoint, setCurrentBreakpoint] = useState("");
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1536);

    useEffect(() => {
        const checkBreakpoint = () => {
            if (window.innerWidth >= breakpoints["3xl"]) setCurrentBreakpoint("3xl");
            else if (window.innerWidth >= breakpoints["2xl"]) setCurrentBreakpoint("2xl");
            else if (window.innerWidth >= breakpoints.xl) setCurrentBreakpoint("xl");
            else if (window.innerWidth >= breakpoints.lg) setCurrentBreakpoint("lg");
            else if (window.innerWidth >= breakpoints.md) setCurrentBreakpoint("md");
            else if (window.innerWidth >= breakpoints.sm) setCurrentBreakpoint("sm");
            else setCurrentBreakpoint("none");
            setIsLargeScreen(window.innerWidth > 1536);
        }

        checkBreakpoint();

        window.addEventListener("resize", checkBreakpoint);

        return () => window.removeEventListener("resize", checkBreakpoint);
    }, []);

    return {
        currentBreakpoint,
        isLargeScreen
    }
}

export default useTailwindBreakpoint;

