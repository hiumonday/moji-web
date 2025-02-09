import axios from 'axios';
import { setLoader, setPosts, setPost, setTags, setAuthors, setPostsByTag, setFeatured, setPostsByAuthor } from '../slices/ghostSlice';
import { setError } from '../slices/appSlice';

export const getPosts = () => async (dispatch) => {
    try {
        dispatch(setLoader(true));
        const { data } = await axios.get('/api/v1/posts');
        // console.log(data)
        dispatch(setPosts(data));
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.toString()));
    }
};

export const getPost = (slug) => async (dispatch) => {
    try {
        dispatch(setLoader(true));
        const { data } = await axios.get(`/api/v1/posts/${slug}`);
        dispatch(setPost(data.data));
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.toString()));
    }
};

export const getTags = () => async (dispatch) => {
    try {
        dispatch(setLoader(true));
        const { data } = await axios.get('/api/v1/tags');
        dispatch(setTags(data.data));
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.toString()));
    }
};

export const getAuthors = () => async (dispatch) => {
    try {
        dispatch(setLoader(true));
        const { data } = await axios.get('/api/v1/authors');
        dispatch(setAuthors(data));
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.toString()));
    }
};

export const getPostsByTag = (tag) => async (dispatch) => {
    try {
        dispatch(setLoader(true));
        const { data } = await axios.get(`/api/v1/tags/${tag}/posts`);
        dispatch(setPostsByTag(data.data));
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.toString()));
    }
};

export const getPostsByAuthor = (author) => async (dispatch) => {
    try {
        dispatch(setLoader(true));
        const { data } = await axios.get(`/api/v1/authors/${author}/posts`);
        dispatch(setPostsByAuthor(data.data));
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.toString()));
    }
};



export const getFeatured = () => async (dispatch) => {
    try {
        dispatch(setLoader(true));
        const { data } = await axios.get('/api/v1/featured');
        dispatch(setFeatured(data.data));
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.toString()));
    }
};