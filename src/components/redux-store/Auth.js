import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let Token = '' ;
let userLogin = false;
if(localStorage.Token){
    Token = localStorage.getItem('Token');
    userLogin = true;
    axios.defaults.headers['token'] = Token
}

const initialState = {
    token: Token,
    loginState: userLogin,
}

const AuthSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers:{
     setUserVerified (state,action){
        state.token = action.payload.token;
        localStorage.setItem('Token', action.payload.token);
        state.loginState = true;
        axios.defaults.headers['token'] = action.payload.token
     },
     setlogout (state){
        state.token = null;
        state.loginState = false;
        localStorage.removeItem('Token');
        axios.defaults.headers['token'] = null;
     }
    }
})

export default AuthSlice;