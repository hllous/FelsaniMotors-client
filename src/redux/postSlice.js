import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "https://jsonplaceholder.typicode.com/posts";

export const fecthPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get(URL);
  return data;
});

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (newPost) => {
    const { data } = await axios.post(URL, newPost);
    return data;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (updatedPost) => {
    const { id, title, body } = updatedPost;
    const { data } = await axios.put(`${URL}/${id}`, { title, body });
    return data;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fecthPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fecthPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fecthPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default postSlice.reducer;
