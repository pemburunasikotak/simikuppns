import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { TLoginParam } from "@/api/auth/type";
import { ProkerSessionUser, ProkerSessionToken } from "@/libs/localstorage/proker-session";
import { TUserItem } from "@/api/user/type";
import { postLoginProker, postLogoutProker } from "@/api/proker/auth/api";

type ProkerSession = {
  signin: (payload: TLoginParam) => void;
  signout: () => void;
  session?: {
    access_token: string;
  };
  status?: "authenticated" | "authenticating" | "unauthenticated";
};

const ProkerSessionContext = createContext<ProkerSession>({
  signin: () => { },
  signout: () => { },
  session: undefined,
  status: undefined,
});

const usePostLoginProker = () => {
  return useMutation({
    mutationFn: postLoginProker,
  });
};

const ProkerSessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<ProkerSession["session"]>();
  const [status, setStatus] = useState<ProkerSession["status"]>();
  const [, setSearchParams] = useSearchParams();

  const postLogin = usePostLoginProker();

  useEffect(() => {
    const session = ProkerSessionToken.get();
    if (session && session.access_token) {
      setSessionData({
        access_token: session.access_token,
      });
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const signin = (payload: TLoginParam) => {
    setStatus("authenticating");
    postLogin.mutate(payload, {
      onSuccess: (res: unknown) => {
        const payload = res as Record<string, unknown>;
        const access_token = (payload?.access_token || (payload?.data as Record<string, unknown>)?.access_token || (payload?.result as Record<string, unknown>)?.access_token || payload?.token || (payload?.data as Record<string, unknown>)?.token || (payload?.result as Record<string, unknown>)?.token) as string;
        const refresh_token = (payload?.refresh_token || (payload?.data as Record<string, unknown>)?.refresh_token || (payload?.result as Record<string, unknown>)?.refresh_token || payload?.refreshToken || (payload?.data as Record<string, unknown>)?.refreshToken) as string;
        const user = payload?.user || (payload?.data as Record<string, unknown>)?.user || payload;

        setSessionData(access_token ? { access_token } : undefined);

        if (access_token) {
          ProkerSessionToken.set({
            access_token,
            refresh_token: refresh_token || "", // fallback if refresh token not returned
          });
        }

        ProkerSessionUser.set({ user: user as TUserItem });

        setStatus("authenticated");

        setTimeout(() => {
          navigate("/proker/dashboard", { replace: true });
        }, 600);
      },
      onError: () => {
        setSearchParams({
          error: "Username atau password salah",
        });
        setStatus("unauthenticated");
      },
    });
  };

  const signout = () => {
    navigate("/auth/login-proker");
    setStatus("unauthenticated");
    postLogoutProker().catch((err) => console.error("Logout API error:", err));
    setSessionData(undefined);
    ProkerSessionUser.remove();
    ProkerSessionToken.remove();
  };

  return (
    <ProkerSessionContext.Provider
      value={{
        session: sessionData,
        status,
        signin,
        signout,
      }}
    >
      {children}
    </ProkerSessionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProkerSession = () => {
  return useContext(ProkerSessionContext);
};

export default ProkerSessionProvider;
