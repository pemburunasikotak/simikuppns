import { SessionToken } from "@/libs/cookies";
import { ProkerSessionToken } from "@/libs/localstorage/proker-session";
import { LoaderFunctionArgs, redirect } from "react-router";
import { paths } from "./commons/constants/paths";

const mappingPublicRoutes = ["/portal-login", "/auth/login", "/auth/login-proker", "/auth/oauth-callback", "/dashboard", "/"];

export const middleware = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const SessionTokenData = SessionToken.get();
  const ProkerTokenData = ProkerSessionToken.get();

  const pathname = url.pathname;

  if (mappingPublicRoutes.includes(pathname)) {
    return null;
  }

  // Protect Proker routes
  if (pathname.startsWith("/proker")) {
    if (!ProkerTokenData) {
      return redirect(`${paths.auth.loginProker}?error=Sesi habis. Silakan login kembali.`);
    }
    return null;
  }

  // Protect IKU routes
  if (!SessionTokenData) {
    // return redirect(`${paths.auth.login}?error=Sesi habis. Silakan login kembali.`);
    return null; // keeping existing logic for IKU
  }

  return null;
};
