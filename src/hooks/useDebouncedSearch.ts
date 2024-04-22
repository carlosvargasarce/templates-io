import { useCallback, useState } from 'react';

const useDebouncedSearch = (searchFunction: (searchTerm: string) => void) => {
  const [timer, setTimer] = useState<number | null>(null);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (timer !== null) {
        clearTimeout(timer);
      }

      const newTimer = window.setTimeout(() => {
        searchFunction(searchTerm);
      }, 500); // Delay de 500 ms

      setTimer(newTimer);
    },
    [searchFunction, timer]
  );

  return handleSearch;
};

export default useDebouncedSearch;
