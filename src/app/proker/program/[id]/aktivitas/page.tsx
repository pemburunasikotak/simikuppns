import { FC, ReactElement, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";

const AktivitasRedirect: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (id) {
      navigate(`/proker/program/${id}${location.search}`, { replace: true });
    }
  }, [id, navigate, location.search]);

  return <></>;
};

export default AktivitasRedirect;
