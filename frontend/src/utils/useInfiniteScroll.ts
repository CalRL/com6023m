import React, { useEffect } from "react";

type UseInfiniteScrollOptions = {
    callback: () => void;
    hasMore: boolean;
    loading: boolean;
    observerRef: React.RefObject<HTMLElement | null>;
};


/**
 * Hook for implementing infinite scroll using IntersectionObserver.
 *
 * This hook observes a given DOM element (typically a "sentinel" div at the end of a list),
 * and triggers a callback function when it enters the viewport—used for loading more content.
 *
 * @param {Object} options - Configuration options for the hook.
 * @param {() => void} options.callback - function to call when the observer detects intersection.
 * @param {boolean} options.hasMore - whether more data is available to load.
 * @param {boolean} options.loading - whether data is currently being loaded (to prevent duplicate calls).
 * @param {React.RefObject<HTMLElement | null>} options.observerRef - a ref to the DOM element to observe.
 *
 * @example
 * const sentinelRef = useRef(null);
 * useInfiniteScroll({ callback: fetchPosts, hasMore, loading, observerRef: sentinelRef });
 */
export default function useInfiniteScroll({
  callback,
  hasMore,
  loading,
  observerRef,
}: UseInfiniteScrollOptions) {

    useEffect(() => {
        if (!observerRef?.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading && hasMore) {
                callback();
            }
        });

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [callback, hasMore, loading, observerRef]);
}
