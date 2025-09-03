// publicRoutes.js - Fixed redirect destination
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'


function UserRoutes() {
    const customerLogin = useSelector(state => state.auth.customerLogin);

    return customerLogin ? <Navigate to='/dashboard' /> : <Outlet />
}

export default UserRoutes