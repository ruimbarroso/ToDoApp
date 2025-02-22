/* eslint-disable @typescript-eslint/no-unused-vars */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import { useEffect, useState, type ReactNode } from "react";
import LoadingCircle from "../components/LoadingCircle/LoadingCircle";
import { MessageType, usePopUps } from "../context/popupsContext";

/**
 * A protected route component that ensures only authenticated users can access its children.
 * If the user is not authenticated, they are redirected to the login page.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render if the user is authenticated.
 * @returns {JSX.Element} - Returns the children if the user is authenticated, otherwise redirects to the login page.
 */
const ProtectedRoute = ({ children }: {
  children: ReactNode;
}) => {
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
