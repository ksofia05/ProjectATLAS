import { useState, useEffect, useRef } from 'react';

export default function useOnScreen(options) {
const ref = useRef(null);
const [isIntersecting, setIntersecting] = useState(false);

useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
        setIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
        observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
}