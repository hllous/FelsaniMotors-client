import { createSlice } from '@reduxjs/toolkit';

// --------------- SLICE ---------------

const transaccionesSlice = createSlice({
  name: 'transacciones',
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

export default transaccionesSlice.reducer;
