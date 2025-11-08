import { createSlice } from '@reduxjs/toolkit';

// --------------- SLICE ---------------

const publicacionesSlice = createSlice({
  name: 'publicaciones',
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

export default publicacionesSlice.reducer;

