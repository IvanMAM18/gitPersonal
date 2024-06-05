import { createSlice } from '@reduxjs/toolkit'

export const negociosSlice = createSlice({
  name: 'counter',
  initialState: {
    negocios: [],
  },
  reducers: {
    setNegocios: (state, action) => {
      state.negocios = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setNegocios } = negociosSlice.actions

export default negociosSlice