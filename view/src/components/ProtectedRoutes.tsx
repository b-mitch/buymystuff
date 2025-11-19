import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoutes: React.FC<any> = ({token}) => {
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
