import { createSlice } from '@reduxjs/toolkit';

// --------------- SLICE ---------------

const carritoSlice = createSlice({
  name: 'carrito',
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

export default carritoSlice.reducer;
