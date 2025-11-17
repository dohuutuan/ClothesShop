import { useEffect, useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query';
import { getProfileApi } from './services/userService';
import { login, logout } from './store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isLogin = useSelector((state: any) => state.auth.login);
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");    
    if (token != null) {
      setTokenReady(true);
    }
  }, [isLogin])

  const { data, isSuccess, isError } = useQuery({
    queryFn: getProfileApi,
    queryKey: ['profile'],
    enabled: tokenReady,
    retry: 0,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(login(data));
    }
    if (isError) {
      dispatch(logout());
    }
  }, [data, isSuccess, isError, dispatch, navigate]);
  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  )
}

export default App
