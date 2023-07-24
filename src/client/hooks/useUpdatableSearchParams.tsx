import { useSearchParams } from "react-router-dom";

export const useUpdatableSearchParams = () => {
  const [params, setParams] = useSearchParams();
  const updateParams = (updates: Record<string, any>) => {
    for (const [key, value] of Object.entries(updates)) {
      params.set(key, value);
    }
    setParams(params);
  };
  return [params, updateParams] as const;
};
