import { createSlice } from '@reduxjs/toolkit';

// --------------- SLICE ---------------

const autosSlice = createSlice({
  name: 'autos',
  initialState: {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    // TODO: Implementar reducers cuando sea necesario
  },
});

export default autosSlice.reducer;
