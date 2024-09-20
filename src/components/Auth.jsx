import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const Auth = (props) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  
  return auth.isLoggedIn ? (
    props.children
  ) : (
    <Navigate to={"/login"} replace state={{preLocation:location}} />
  );
};

export default Auth;
