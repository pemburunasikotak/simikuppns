import { useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { SessionToken } from "@/libs/cookies";
import { paths } from "@/commons/constants/paths";

const Component = () => {
  const navigate = useNavigate();
  const searchParams = useSearchParams();

  const signInCallback = useCallback(async () => {
    const code = searchParams[0].get("code");
    if (!code) return navigate("/auth/login");
  }, [searchParams, navigate]);

  useEffect(() => {
    signInCallback();
  }, [signInCallback]);

  useEffect(() => {
    const session = SessionToken.get();
    if (session) navigate(paths.dashboard);
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default Component;
