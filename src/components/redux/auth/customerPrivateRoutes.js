import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function CustomerPrivateRoutes() {
    const customerLogin = useSelector(state => state.auth.customerLogin);
    
    return customerLogin ? <Outlet /> : <Navigate to='/customer-login' />
}

export default CustomerPrivateRoutes