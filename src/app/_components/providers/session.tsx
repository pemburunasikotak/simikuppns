import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { TLoginParam } from "@/api/auth/type";
import { SessionUser } from "@/libs/localstorage";
import { SessionToken } from "@/libs/cookies";
import { usePostLogin } from "@/app/(public)/auth/login/_hooks/use-post-login";
import { postLogout } from "@/api/auth/api";

type Session = {
  signin: (payload: TLoginParam) => void;
  signout: () => void;
  session?: {
    access_token: string;
  };
  status?: "authenticated" | "authenticating" | "unauthenticated";
};

const SessionContext = createContext<Session>({
  signin: () => { },
  signout: () => { },
  session: undefined,
  status: undefined,
});

const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<Session["session"]>();
  const [status, setStatus] = useState<Session["status"]>();
  const [, setSearchParams] = useSearchParams();

  const postLogin = usePostLogin();

  useEffect(() => {
    const session = SessionToken.get();
    // const user = SessionUser.get();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (res: any) => {
        const access_token = res?.access_token || res?.data?.access_token || res?.result?.access_token || res?.token || res?.data?.token || res?.result?.token;
        const refresh_token = res?.refresh_token || res?.data?.refresh_token || res?.result?.refresh_token || res?.refreshToken || res?.data?.refreshToken;
        const user = res?.user || res?.data?.user || res;

        setSessionData(access_token ? { access_token } : undefined);

        if (access_token) {
          SessionToken.set({
            access_token,
            refresh_token,
          });
        }

        SessionUser.set({ user });

        setStatus("authenticated");

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 600);
      },
      onError: () => {
        setSearchParams({
          error: "Email atau password salah",
        });
        setStatus("unauthenticated");
      },
    });
  };

  const signout = () => {
    navigate("/");
    setStatus("unauthenticated");
    postLogout().catch((err) => console.error("Logout API error:", err));
    setSessionData(undefined);
    SessionUser.remove();
    SessionToken.remove();

  };
  return (
    <SessionContext.Provider
      value={{
        session: sessionData,
        status,
        signin,
        signout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => {
  return useContext(SessionContext);
};

export default SessionProvider;
