import { createSlice } from "@reduxjs/toolkit";

let Token = '' ;
let userLogin = false;
if(localStorage.Token){
    Token = localStorage.getItem('Token');
    userLogin = true;
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
     },
     setlogout (state){
        state.token = null;
        state.loginState = false;
        localStorage.removeItem('Token');
     }
    }
})

export default AuthSlice;