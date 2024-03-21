import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let FYear = { label: 'FY 2024-2025', value: '24' };
axios.defaults.headers['fy_id'] = FYear?.value;
if(localStorage.FYear){
    let temp  = localStorage.getItem('FYear');
    FYear = JSON.parse(temp)
    axios.defaults.headers['fy_id'] = FYear?.value;
   
}

const initialState = {
   FYear,
}

const FinancialYearSlice = createSlice({
    name: 'FinancialYear',
    initialState,
    reducers:{
     editFinancialYear(state,action){
        state.FYear = action.payload;
        localStorage.setItem('FYear' , JSON.stringify(action.payload))
        axios.defaults.headers['fy_id'] = action.payload?.value;
     },
    }
})

export default FinancialYearSlice;