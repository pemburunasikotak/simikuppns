import { useSearchParams, useNavigate } from "react-router";
import { useMemo } from "react";

export const useFilter = <T = Record<string, unknown>>() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentParams = useMemo(() => {
    const entries = Array.from(searchParams.entries());
    return Object.fromEntries(entries);
  }, [searchParams]);

  const setFilter = (newParams: Partial<T>) => {
    const updatedParams = {
      ...currentParams,
      ...newParams,
    };

    Object.keys(updatedParams).forEach((key) => {
      if (
        updatedParams[key] === null ||
        updatedParams[key] === undefined ||
        updatedParams[key] === ""
      ) {
        delete updatedParams[key];
      }
    });

    const search = new URLSearchParams(updatedParams as Record<string, string>).toString();
    navigate(`?${search}`, { replace: true });
  };

  return {
    filters: currentParams as T,
    setFilter,
  };
};
