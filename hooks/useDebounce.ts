import { useEffect, useState } from "react";

// example usage, will be delayed by 400ms:
// const debouncedSearch = useDebounce(search, 400) // debounce search to reduce requests and server load
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
