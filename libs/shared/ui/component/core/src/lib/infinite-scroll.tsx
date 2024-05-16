import { useEffect, useRef } from 'react';

type InfiniteScrollProps = {
  onIntersect: () => void;
  rootMargin?: string;
  threshold?: number;
};

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onIntersect,
  rootMargin = '0px',
  threshold = 0.75,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [onIntersect, rootMargin, threshold]);

  return <div ref={sentinelRef}></div>;
};
