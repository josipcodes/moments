import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

    const handleMount = async () => {
      try {
        const { data } = await axios.get("dj-rest-auth/user/");
      } catch (err) {
        console.log(err);
      }
    };
  
    useEffect(() => {
      handleMount();
    }, []);

    // refreshing tokens
    useMemo(() => {
      // request interceptor
      axiosReq.interceptors.request.use(
        async (config) => {
          try {
            // attempting to refresh the token
            await axios.post('dj-rest-auth/token/refresh/')
          } catch(err) {
            // if token refresh failed and user was previously logged in
            // refresh token has expired
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser){
                history.push('/signin')
              }
              return null
            })
            return config
          }
          return config
        },
        (err) => {
          return Promise.reject(err);
        }
      )

      // response interceptor
      axiosRes.interceptors.response.use(
        (response) => response,
        async (err) => {
          if (err.response?.status === 401){
            try{
              await axios.post('dj-rest-auth/token/refresh/')
            } catch(err) {
              setCurrentUser((prevCurrentUser) => {
                if (prevCurrentUser){
                  history.push('/signin')
                }
                return null
              })
            }
            return axios(err.config)
          }
          // Promise rejected if error wasn't 401
          return Promise.reject(err)
        }
      );
    }, [history]);

    return (
        // these context object providers allow current user value and the 
        // function to update it to be available to every child component in our application
        <CurrentUserContext.Provider value={currentUser}>
        <SetCurrentUserContext.Provider value={setCurrentUser}>
            {children}
        </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    )
};