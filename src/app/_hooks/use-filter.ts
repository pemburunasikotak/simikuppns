import { useSearchParams, useNavigate } from "react-router";
import { useMemo } from "react";

export const useFilter = <T = Record<string, unknown>>() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentParams = useMemo(() => {
    const entries = Array.from(searchParams.entries());
    const params = Object.fromEntries(entries);
    return {
      ...params,
      page: params.page ? Number(params.page) : 1,
      per_page: params.per_page ? Number(params.per_page) : 50,
    };
  }, [searchParams]);

  const setFilter = (newParams: Partial<T>) => {
    const updatedParams: Record<string, unknown> = {
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
