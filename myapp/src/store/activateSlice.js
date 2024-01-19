import { createSlice } from '@reduxjs/toolkit'
//These are all the things that are stored inside this state
const initialState = {
  name:'',
  avatar:'',
}
export const activateSlice = createSlice({
  name: 'activate',
  initialState,
  //these are the function that will be called to alter the data inside state
  reducers: {
    setName: (state,action) => {
      state.name = action.payload;
    },
    setAvatar : (state,action) => {
      state.avatar = action.payload;
    },
  },
})
export const {setName,setAvatar} = activateSlice.actions
export default activateSlice.reducer