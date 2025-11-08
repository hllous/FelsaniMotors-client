import { createSlice } from '@reduxjs/toolkit';

// --------------- SLICE ---------------

const comentariosSlice = createSlice({
  name: 'comentarios',
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

export default comentariosSlice.reducer;
