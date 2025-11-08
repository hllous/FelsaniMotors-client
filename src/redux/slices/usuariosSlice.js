import { createSlice } from '@reduxjs/toolkit';

// --------------- SLICE ---------------

const usuariosSlice = createSlice({
  name: 'usuarios',
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

export default usuariosSlice.reducer;
