import {
     setDailySummary, setSubmittedDailySummary, setDailyLeaderboard, setDailySummaryResult, setDaillyPercentile, setIsDoneDaily
} from "../slices/dailySummarizeSlice";
import { setError, setSuccess } from "../slices/appSlice";
import axios from "axios";
import { setLoader } from "../slices/testSlice";




export const getSummaryData = () => async (dispatch) => {
    try {
        dispatch(setLoader(true));

        const { data } = await axios.get(
            `/api/v1/daily`, {
            withCredentials: true,
        }

        );
        console.log(data)
        dispatch(setDailySummary(data.data.testId));
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.response.data.message));
    }
};

export const isDoneDaily = () => async (dispatch) => {
    try {
        dispatch(setLoader(true));

        const { data } = await axios.get(
            `/api/v1/done-daily`, {
            withCredentials: true,
        }
        );
        dispatch(setIsDoneDaily(data.data));
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.response.data.message));
    }
};



export const submitSummary = (userId, data) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('http://127.0.0.1:5001/similarity_single', data);
            let score = response.data.total_score;
            const calculateBonus = (time) => {
                if (time < 120) return 20;
                if (time < 140) return 15;
                if (time < 150) return 10;
                if (time < 180) return 5;
                if (time > 210) return -Math.min(10, Math.floor((time - 210) / 10) * 10);
                return 0;
            };


             score = score + calculateBonus(data.time);
             
            const response2 = await axios.post(`${REACT_APP_API_URL}/api/v1/daily/${userId}`, {
                comments: response.data.sentence_scores_explained,
                user: userId,
                score: score,
                passage: data.id,
                highlight: data.highlights,
                dayNumber: data.dayNumber
            }, {
                withCredentials: true,
            });

            const summaryResultId = response2.data.result._id;
            return summaryResultId;
        } catch (error) {
            console.error(error);
            dispatch({ type: 'SUMMARY_ERROR', payload: error.message });
            return null;
        }
    };
};

export const getSummaryResult = (resultsId) => async (dispatch) => {
    console.log(resultsId);
    try {
        dispatch(setLoader(true));

        const { data } = await axios.get(
            `/api/v1/daily_results/${resultsId}`, {
            withCredentials: true,
        }
        );
        dispatch(setSubmittedDailySummary(data.data)); // Assuming data structure matches your needs
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.response.data.message));
    }
};

export const getLeaderboard = (dayNumber) => async (dispatch) => {
    try {
        dispatch(setLoader(true));

        const { data } = await axios.get(
            `/api/v1/daily-leaderboard/${dayNumber}`, {
            withCredentials: true,
        }
        );
        //   console.log(data)
        dispatch(setDailyLeaderboard(data.data)); // Assuming data structure matches your needs
        dispatch(setLoader(false));
    } catch (err) {
        dispatch(setLoader(false));
        dispatch(setError(err.response.data.message));
        console.log(err)
    }
};



// get own exams
export const getOwnSummary = (userId) => async (dispatch) => {
    try {

        dispatch(setLoader(true));
        const { data } = await axios.get(`/api/v1/me/own-daily/${userId}`, {
            withCredentials: true,
        });
        // console.log(data)
        dispatch(setDailySummaryResult(data.exams));
        dispatch(setLoader(false));
    } catch (err) {
        console.log(err)
        dispatch(setLoader(false));
        dispatch(setError(err.response.data.message));
    }
};

export const getPercentile = (dayNumber) => async (dispatch) => {
    try {

        dispatch(setLoader(true));
        const { data } = await axios.get(`/api/v1/me/daily-percentile/${dayNumber}`, {
            withCredentials: true,
        });
        dispatch(setDaillyPercentile(data.data));
        dispatch(setLoader(false));
    } catch (err) {
        console.log(err)
        dispatch(setLoader(false));
        dispatch(setError(err.response.data.message));
    }
};
