/* eslint-disable @typescript-eslint/no-unused-vars */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import { useEffect, useState, type ReactNode } from "react";
import LoadingCircle from "../components/LoadingCircle/LoadingCircle";
import { MessageType, usePopUps } from "../context/popupsContext";

interface RouteProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: RouteProps) => {
  const { user, refresh } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { shift } = usePopUps();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await refresh();
      } catch (err) {
        shift({ message: "You are not Login!", messageType: MessageType.ERROR });
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [refresh, shift]);

  if (isLoading) {
    return <LoadingCircle />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
