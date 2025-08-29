// useAuth.js - No changes needed
import { useSelector } from 'react-redux'

export const useAuth = () => {
  const isLogin = useSelector(state => state.auth?.isLogin);
  return isLogin
}