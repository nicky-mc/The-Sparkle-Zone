import { useEffect } from "react";

type Event = MouseEvent | TouchEvent;

export default function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: Event) => void
) {
  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener, { passive: true }); // Mark the event listener as passive

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
