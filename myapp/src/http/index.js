import axios from "axios";
const api = axios.create({
  baseURL: "https://couch-critic-deployment.vercel.app",
  withCredentials: true, //to allow cookies transfer
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//List of all endpoints
export const sendOtp = (data) => api.post("/api/otp-send", data);
export const verifyOtp = (data) => api.post("/api/verify-otp", data);
export const activate = (data) => api.post("/api/activate", data);
export const logout = () => api.post("/api/logout");
export const createRoom = (data) => api.post("/api/rooms",data);
export const getAllRooms = () => api.get("/api/rooms");
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`);

//Interceptors
//In Case Our User Is not able to activate his account before the token is expired we'll automatically catch this error and generate new token 
//for them and then automatically to the activate process again without the use knowing
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if(error.response.status===401 && originalRequest && !originalRequest._isRetry){
        originalRequest._isRetry = true;
        try{
            await api.get("/api/refresh",{withCredentials:true});
            return api.request(originalRequest);
        }catch(err){
            console.log(err.message);
        }
    }
    throw error;
  }
);

export default api;
