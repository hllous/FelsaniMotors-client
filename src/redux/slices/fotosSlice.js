import { createSlice } from '@reduxjs/toolkit';

// --------------- SLICE ---------------

const fotosSlice = createSlice({
  name: 'fotos',
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

export default fotosSlice.reducer;
