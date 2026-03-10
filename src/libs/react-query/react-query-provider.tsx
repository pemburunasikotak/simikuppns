import type { FC, PropsWithChildren, ReactElement } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./react-query-client";

export const ReactQueryProvider: FC<PropsWithChildren> = ({ children }): ReactElement => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
