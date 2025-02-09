import {
	setLoader,
	setSummary,
    setSubmittedSummary,
    setLeaderboard,
    setOwnSummary,
    setPercentile
} from "../slices/summarizeSlice";
import { setError, setSuccess } from "../slices/appSlice";
import axios from "axios";




export const getSummaryData = (userId) => async (dispatch) => {
    try {
      dispatch(setLoader(true));
  
      const { data } = await axios.get(
        `/api/v1/passages/${userId}`, {
          withCredentials: true,
        }
      );
      dispatch(setSummary(data.data));
      dispatch(setLoader(false));
    } catch (err) {
      dispatch(setLoader(false));
      dispatch(setError(err.response.data.message));
    }
  };
  
export const submitSummary = (userId, data) => {
    return async (dispatch) => {
        // Format the data to match the expected structure
        const formattedData = {
            easy: {
                highlightedText: data.easy.highlightedText,
                summary: data.easy.summary
            },
            medium: {
                highlightedText: data.medium.highlightedText,
                summary: data.medium.summary
            },
            hard: {
                highlightedText: data.hard.highlightedText,
                summary: data.hard.summary
            },
        };

        try {
            // Make an HTTP POST request to the API
            const response = await axios.post('http://127.0.0.1:5001/similarity', formattedData);


            // Extract the scores from the response
            const { easy, medium, hard } = response.data.total_scores;

            // Calculate the scores
            const calculateBonus = (difficulty, time) => {
                if (difficulty === 'easy') {
                    if (time < 15) return 20;
                    if (time < 20) return 15;
                    if (time < 50) return 10;
                    if (time > 60) return -Math.min(5, Math.floor((time - 60) / 10) * 5);
                    return 0;
                } else if (difficulty === 'medium') {
                    if (time < 120) return 20;
                    if (time < 140) return 15;
                    if (time < 150) return 10;
                    if (time < 180) return 5;
                    if (time > 210) return -Math.min(10, Math.floor((time - 210) / 10) * 10);
                    return 0;
                } else if (difficulty === 'hard') {
                    if (time < 180) return 20;
                    if (time < 200) return 15;
                    if (time < 220) return 10;
                    if (time < 240) return 5;
                    if (time > 280) return -Math.min(10, Math.floor((time - 280) / 10) * 10);
                    return 0;
                }
            };

            const easyScore = easy + calculateBonus('easy', data.easy.time);
            const mediumScore = medium + calculateBonus('medium', data.medium.time);
            const hardScore = hard + calculateBonus('hard', data.hard.time);

            // Calculate the total score
            const totalScore = easyScore + mediumScore + hardScore;

            // Create a summary result in the database 

            const response2 = await axios.post(`/api/v1/summary/${userId}`, {
                comments: response.data.sentence_scores_explained,
                user: userId,
                score: totalScore,
                easy: {
                    score: easyScore,
                    passage: data.easy.id,
                    highlight: data.easy.highlights,
                },
                medium: {
                    score: mediumScore,
                    passage: data.medium.id,
                    highlight: data.medium.highlights,
                },
                hard: {
                    score: hardScore,
                    passage: data.hard.id,
                    highlight: data.hard.highlights,
                },
            }, {
                withCredentials: true,
            });
            
            const summaryResultId = response2.data.data._id;
            return summaryResultId;
        } catch (error) {
            // Handle errors if any
            console.error(error);
        }
    };
};

export const getSummaryResult = (resultsId) => async (dispatch) => {
    try {
      dispatch(setLoader(true));
  
      const { data } = await axios.get(
        `/api/v1/summary_results/${resultsId}`, {
          withCredentials: true,
        }
      );
      dispatch(setSubmittedSummary(data.data)); // Assuming data structure matches your needs
      dispatch(setLoader(false));
    } catch (err) {
      dispatch(setLoader(false));
      dispatch(setError(err.response.data.message));
    }
  };

  export const getLeaderboard = () => async (dispatch) => {
    try {
      dispatch(setLoader(true));
  
      const { data } = await axios.get(
        '/api/v1/leaderboard', {
          withCredentials: true,
        }
      );
    //   console.log(data)
      dispatch(setLeaderboard(data.data)); // Assuming data structure matches your needs
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
		const { data } = await axios.get(REACT_APP_API_URL +`/api/v1/me/own-summary/${userId}`, {
			withCredentials: true,
		});
        // console.log(data)
		dispatch(setOwnSummary(data.exams));
		dispatch(setLoader(false));
	} catch (err) {
		console.log(err)
		dispatch(setLoader(false));
		dispatch(setError(err.response.data.message));
	}
};

export const getPercentile = () => async (dispatch) => {
	try {

		dispatch(setLoader(true));
		const { data } = await axios.get(REACT_APP_API_URL +`/api/v1/me/percentile`, {
			withCredentials: true,
		});
		dispatch(setPercentile(data.data));
		dispatch(setLoader(false));
	} catch (err) {
		console.log(err)
		dispatch(setLoader(false));
		dispatch(setError(err.response.data.message));
	}
};

// get all exams --admin
// export const getAllExams = () => async (dispatch) => {
// 	try {
// 		dispatch(setDetailsLoader(true));
// 		const { data } = await axios.get(`/api/v1/admin/exams`, {
// 			withCredentials: true,
// 		});

// 		dispatch(setAllExams(data.exams));
// 		dispatch(setDetailsLoader(false));
// 	} catch (err) {
// 		console.log(err)
// 		dispatch(setDetailsLoader(false));
// 		dispatch(setError(err.response.data.message));
// 	}
// };
