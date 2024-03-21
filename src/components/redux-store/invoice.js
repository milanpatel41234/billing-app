import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    SalesInvoiceData: null,
    PurchaseInvoiceData: null,
    QuotationData: null,
    NoteData: null,
}

const InvoiceSlice = createSlice({
    name: 'Invoice',
    initialState,
    reducers:{
     editSalesInvoice(state,action){
        state.SalesInvoiceData = action.payload;
     },
     editPurchaseInvoice(state,action){
        state.PurchaseInvoiceData = action.payload;
     },
     editQuotation(state,action){
        state.QuotationData = action.payload;
     },
     editNote(state,action){
        state.QuotationData = action.payload;
     },
    
    }
})

export default InvoiceSlice;