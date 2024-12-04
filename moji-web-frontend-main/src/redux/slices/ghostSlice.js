import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    posts: [],
    post: null,
    tags: [],
    authors: [],
    postsByTag: [],
};

const ghostSlice = createSlice({
    name: "ghost",
    initialState,
    reducers: {
        setLoader: (state, action) => {
            state.isLoading = action.payload;
        },
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setPost: (state, action) => {
            state.post = action.payload;
        },
        setTags: (state, action) => {
            state.tags = action.payload;
        },
        setAuthors: (state, action) => {
            state.authors = action.payload;
        },
        setPostsByTag: (state, action) => {
            state.postsByTag = action.payload;
        },
        setPostsByAuthor: (state, action) => {
            state.postsByAuthor = action.payload;
        },
        setFeatured: (state, action) => {
            state.featured = action.payload;
        },
    },
});

export const { setLoader, setPosts, setPost, setTags, setAuthors, setPostsByTag, setFeatured, setPostsByAuthor } = ghostSlice.actions;
export default ghostSlice.reducer;