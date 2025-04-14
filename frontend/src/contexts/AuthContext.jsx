// import React, { createContext } from 'react';
// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//   const handleLogin = async (username, password) => {
//     // Replace with real login logic
//     console.log("Logging in:", username, password);
//     return "Login successful";
//   };
//   const handleRegister = async (name, username, password) => {
//     // Replace with real registration logic
//     console.log("Registering:", name, username, password);
//     return "Registration successful";
//   };
//   return (
//     <AuthContext.Provider value={{ handleLogin, handleRegister }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import axios from "axios";
import httpStatus from "http-status";
import { StatusCodes } from 'http-status-codes';

import { Children, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";



export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "http://localhost:8000/api/v1/users"
})



export const AuthProvider = ({Children}) => {

    const authContext = useContext(AuthContext);


    const [userData, setUserData] = useState(authContext);



    const handleRegister = async(name, username, password) => {
        try{
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })

            if(request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try{
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            if(request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
            }
            } catch (err) {
                throw err;
            }
        }

    const getHistoryOfUser = async () => {
        try{
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch (err){
            throw err;
        }
    }

    
    const addToUserHistory = async (meetingCode) => {
        try{
            let request = await client.get("/add_to_activity", {
                    token: localStorage.getItem("token"),
                    meeting_code: meetingCode
            });
            return request
        } catch (e){
            throw e;
        }
    }
    

    const data = {
        userData, setUserData, getHistoryOfUser, addToUserHistory, handleRegister, handleLogin
    }
        return (
            <AuthContext.Provider value={data}>
                 {Children}
            </AuthContext.Provider>
        )
}
