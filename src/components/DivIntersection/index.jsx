import React, { useEffect, useRef } from "react";

const DivIntersection = ({ children, className, action }) => {
    const divRef = useRef(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && !hasFetched.current) {
                    hasFetched.current = true;
                    action();
                }
            },
            { threshold: 0.1 }
        );

        if (divRef.current) {
            observer.observe(divRef.current);
        }

        return () => {
            if (divRef.current) {
                observer.unobserve(divRef.current);
            }
        }
    }, []);

    return (
        <div className={className} ref={divRef}>{children}</div>
    );
}

export default DivIntersection;