import { useRef } from "react";

interface DebounceParam {
  cb: () => void;
}

export const useDebounce = () => {
  const setTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = ({ cb }: DebounceParam) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setTimeoutRef.current && clearTimeout(setTimeoutRef.current);
    setTimeoutRef.current = setTimeout(() => {
      cb();
    }, 1000);
  };

  return debounce;
};
