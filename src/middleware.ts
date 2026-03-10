import { SessionToken } from "@/libs/cookies";
import { LoaderFunctionArgs, redirect } from "react-router";

import { paths } from "./commons/constants/paths";

const mappingPublicRoutes = ["/", "/auth/login", "/auth/oauth-callback", "/dashboard"];

export const middleware = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const SessionTokenData = SessionToken.get();

  const pathname = url.pathname;

  if (mappingPublicRoutes.includes(pathname)) {
    return null;
  }

  if (!SessionTokenData) {
    return redirect(`${paths.auth.login}?error=Sesi habis. Silakan login kembali.`);
  }

  return null;
};
