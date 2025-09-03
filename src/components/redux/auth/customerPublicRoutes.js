import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function CustomerPublicRoutes() {
    const customerLogin = useSelector(state => state?.auth?.customerLogin);
    
    return customerLogin ? <Navigate to='/customer-dashboard' /> : <Outlet />  
}

export default CustomerPublicRoutes