import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DepartmentState {
  currDepartmentId: string
}

const initialState: DepartmentState = {
  currDepartmentId: '',
}

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    setDepartmentId: (state, action: PayloadAction<string>) => {
      state.currDepartmentId = action.payload
    },
  },
})

// Selector
export const selectDepartmentId = (state: { department: DepartmentState }) =>
  state.department.currDepartmentId

// Actions and reducer
export const { setDepartmentId } = departmentSlice.actions
export default departmentSlice.reducer
