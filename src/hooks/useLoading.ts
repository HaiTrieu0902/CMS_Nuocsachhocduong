import { useState } from 'react';
const useLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const withLoading = async (callback: () => Promise<void>) => {
    try {
      setIsLoading(true);
      await callback();
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, withLoading };
};

export default useLoading;
