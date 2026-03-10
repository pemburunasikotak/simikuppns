import { useMediaQuery } from "react-responsive";

export const useIsMobileScreen = (): boolean => {
  return useMediaQuery({ query: "(max-width: 767px)" });
};
