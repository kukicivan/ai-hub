import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const USERS_VERSION_KEY = "user-management-version";

export function UsersRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const savedVersion = localStorage.getItem(USERS_VERSION_KEY) || "v4";
    navigate(`/users/${savedVersion}`, { replace: true });
  }, [navigate]);

  return null;
}
