/* eslint-disable no-unused-vars */
import { axiosInstance } from "./axiosInstance";
import { useDispatch } from 'react-redux';
import { setLogout } from '../../components/redux/loginForm';
// import { decryptData } from "./encrypted";
// import { setLogout } from "../redux/loginForm";

const ApiFunction = () => {
const setLogouttt = ()=>{
localStorage.removeItem('isLogin_admin');
}

    const handleUserLogout = () => {
        setLogouttt();
    }


    // Define headers
    const header1 = {
        "Content-Type": "application/json",
    };

    const header2 = {
        "Content-Type": "multipart/form-data",
    };
    const dispatch = useDispatch();
    // API Functions
    const get = async (endpoint, params) => {
        try {
            const response = await axiosInstance.get(endpoint, {
                headers: {
                    header1,
                },
                params: {
                    ...params
                }
            });
            return response?.data;
        } catch (error) {
            console.error("Error in GET request:", error);
            if (error?.response?.status === 401) {
                handleUserLogout()
            }else if(error?.response?.status === 403){
                dispatch(setLogout());
                
            }
            throw error;
        }
    };

    const post = async (endpoint, apiData, headers = header1) => {
        try {
            const response = await axiosInstance.post(endpoint, apiData, {
                headers: {
                    ...headers,
                },
            });
            return response?.data;
        } catch (error) {
            console.error("Error in POST request:", error);
            if (error?.response?.status === 401) {
                handleUserLogout()
            }else if(error?.response?.status === 403){
                dispatch(setLogout());
                
            }
            throw error;
        }
    };

    const deleteData = async (endpoint, headers = header1) => {
        try {
            const response = await axiosInstance.delete(endpoint, {
                headers: {
                    ...headers,
                },
            });
            return response?.data;
        } catch (error) {
            console.error("Error in DELETE request:", error);
            if (error?.response?.status === 401) {
                handleUserLogout()
            }else if(error?.response?.status === 403){
                dispatch(setLogout());
                
            }
            throw error;
        }
    };

    const put = async (endpoint, apiData, headers = header1) => {
        try {
            const response = await axiosInstance.put(endpoint, apiData, {
                headers: {
                    ...headers,
                },
            });
            return response?.data;
        } catch (error) {
            console.error("Error in PUT request:", error);
            if (error?.response?.status === 401) {
                handleUserLogout()
            }else if(error?.response?.status === 403){
                dispatch(setLogout());
                
            }
            throw error;
        }
    };

    return {
        get,
        post,
        deleteData,
        put,
        header1,
        header2,
    };
};

export default ApiFunction;
