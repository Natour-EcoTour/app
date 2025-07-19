import axios from 'axios';

export const baseURL = 'http://192.168.0.1:8000/';

export const loginUser = async (email: string, password: string) => {
    try {
        console.log(baseURL, 'CUUU')
        const response = await axios.post(`${baseURL}users/login`, {
            email,
            password,
        });
        console.log("Login response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}
