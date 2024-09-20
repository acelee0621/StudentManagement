import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/reducer/authSlice";

const useAutoLogout = () => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  //创建一个useEffect,用来处理登录状态
  useEffect(() => {
    const timeout = auth.expirationTime - Date.now();
    //判断timeout的值
    if (timeout < 1000 * 60) {
      dispatch(logout());
      return;
    }
    const timer = setTimeout(() => {
      dispatch(logout());
    }, timeout);
    return () => clearTimeout(timer); // 清除定时器
  }, [auth]);
};

export default useAutoLogout;
