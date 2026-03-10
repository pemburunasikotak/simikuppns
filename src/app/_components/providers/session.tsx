import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { TLoginParam } from "@/api/auth/type";
import { SessionUser } from "@/libs/localstorage";
import { SessionToken } from "@/libs/cookies";
import { usePostLogin } from "@/app/(public)/auth/login/_hooks/use-post-login";

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
      onSuccess: (res) => {
        setSessionData(res.data);
        SessionToken.set({
          access_token: res.data.access_token,
        });

        SessionUser.set(res.data);

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
    setStatus("unauthenticated");
    setSessionData(undefined);
    SessionUser.remove();
    SessionToken.remove();
    navigate("/auth/login");
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

export const useSession = () => {
  return useContext(SessionContext);
};

export default SessionProvider;
