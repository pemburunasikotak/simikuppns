import { SessionToken } from "@/libs/cookies";
import { LoaderFunctionArgs } from "react-router";

// import { paths } from "./commons/constants/paths";

const mappingPublicRoutes = ["/portal-login", "/auth/login", "/auth/login-proker", "/auth/oauth-callback", "/dashboard"];

export const middleware = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const SessionTokenData = SessionToken.get();

  const pathname = url.pathname;

  if (mappingPublicRoutes.includes(pathname)) {
    return null;
  }

  if (!SessionTokenData) {
    // if (pathname === "/") {
    //   return redirect(`/portal-login?error=Silakan login terlebih dahulu untuk mengakses portal.`);
    // }
    // return redirect(`${paths.auth.login}?error=Sesi habis. Silakan login kembali.`);
    return null;
  }

  return null;
};
