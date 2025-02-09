import {
	setAllExams,
	setBreakFinished,
	setDetailLoading,
	setDetailsLoader,
	setExam,
	setExamDetails,
	setExamSubmittable,
	setExamSubmitted,
	setExams,
	setHasModuleFinished,
	setLoader,
	setModuleBreak,
	setProxyData
} from "../slices/examSlice";
import { setError, setSuccess } from "../slices/appSlice";
import axios from "axios";



// complete a module
export const completeModule =
	(examId, moduleId, answers, totalTime) => async (dispatch) => {
		try {
			dispatch(setLoader(true));
			const { data } = await axios.put(REACT_APP_API_URL +
				`/api/v1/exam/${examId}/${moduleId}/submit`,
				{ answers, totalTime },
				{ withCredentials: true },
			);

			dispatch(setExam(data.exam));
			dispatch(setHasModuleFinished(false));
			if (data.breakTime) {
				dispatch(setModuleBreak(data.breakTime));
			} else {
				dispatch(setSuccess(data.message));
				dispatch(setExamSubmittable(true));
			}
			dispatch(setLoader(false));
		} catch (err) {
			dispatch(setLoader(false));
			dispatch(setError(err.response.data.message));
		}
	};

// skip module break
export const skipModuleBreak = (examId) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.get(`/api/v1/exam/${examId}/break/skip`, {
			withCredentials: true,
		});

		dispatch(setExam(data.exam));
		dispatch(setHasModuleFinished(false));
		dispatch(setModuleBreak(null));
		dispatch(setBreakFinished(true));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setLoader(false));
		dispatch(setError(err.response.data.message));
	}
};

// finish module break
export const finishModuleBreak = (examId) => async (dispatch) => {
	setTimeout(async () => {
		try {
			dispatch(setLoader(true));
			const { data } = await axios.get(
				`/api/v1/exam/${examId}/break/finish`,
				{
					withCredentials: true,
				},
			);

			dispatch(setExam(data.exam));
			dispatch(setHasModuleFinished(false));
			dispatch(setModuleBreak(null));
			dispatch(setBreakFinished(true));
			dispatch(setLoader(false));
		} catch (err) {
			dispatch(setLoader(false));
			dispatch(setError(err.response.data.message));
		}
	}, 1001);
};

// finish exam
export const finishExam = (examId) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.get(`/api/v1/exam/${examId}/complete`, {
			withCredentials: true,
		});

		dispatch(setExam(data.exam));
		dispatch(setExamSubmitted(true));
	} catch (err) {
		dispatch(setLoader(false));
		dispatch(setError(err.response.data.message));
	}
};

// get exam details
export const getExamDetails = (examId) => async (dispatch) => {
	try {
		dispatch(setDetailLoading(true));
		const { data } = await axios.get(`/api/v1/admin/exam/${examId}`, {
			withCredentials: true,
		});

		dispatch(setExamDetails(data.exam));
		dispatch(setDetailLoading(false));
	} catch (err) {
		dispatch(setDetailLoading(false));
		dispatch(setError(err.response.data.message));
	}
};

// get exam details
export const getUserExamDetails = (examId) => async (dispatch) => {
	try {
		dispatch(setDetailLoading(true));
		const { data } = await axios.get(`/api/v1/admin/exam/${examId}`, {
			withCredentials: true,
		});

		dispatch(setExamDetails(data.exam));
		dispatch(setDetailLoading(false));
	} catch (err) {
		dispatch(setDetailLoading(false));
		dispatch(setError(err.response.data.message));
	}
};

// get own exams
export const getOwnExams = () => async (dispatch) => {
	try {
		dispatch(setDetailsLoader(true));
		const { data } = await axios.get(REACT_APP_API_URL +`/api/v1/me/exams`, {
			withCredentials: true,
		});

		dispatch(setExams(data.exams));
		dispatch(setDetailsLoader(false));
	} catch (err) {
		console.log(err)
		dispatch(setDetailsLoader(false));
		dispatch(setError(err.response.data.message));
	}
};

// get all exams --admin
export const getAllExams = () => async (dispatch) => {
	try {
		dispatch(setDetailsLoader(true));
		const { data } = await axios.get(`/api/v1/admin/exams`, {
			withCredentials: true,
		});

		dispatch(setAllExams(data.exams));
		dispatch(setDetailsLoader(false));
	} catch (err) {
		console.log(err)
		dispatch(setDetailsLoader(false));
		dispatch(setError(err.response.data.message));
	}
};

export const fetchMissingFields = (exam, dataToSend, examId) => async (dispatch) => {
	const fields = [
	  "result_careless_math",
	  "result_careless_verbal",
	  "result_overtime_math",
	  "result_script_skills_verbal",
	  "result_script_subjects_math",
	  "result_script_subjects_verbal",
	];
  
	const missingFields = fields.filter((field) => exam && !exam.hasOwnProperty(field));
  
	if (missingFields.length > 0) {
	  try {
		// Make a proxy API call if the fields don't exist
		const proxyResponse = await axios({
		  method: 'post',
		  url: 'https://moji-api.onrender.com/process_data',
		  data: dataToSend,
		  headers: {
			'Content-Type': 'application/json',
		  },
		});
  
		const proxyData = proxyResponse.data;
		const proxyStatusCode = proxyResponse.status;
  
		// Update the exam results with the proxy data
		const updatedData = {
		  ...dataToSend,
		  ...proxyData,
		};
  
		const response = await axios.put(
		  `${REACT_APP_API_URL}/api/v1/exam/${examId}/results`,
		  updatedData,
		  { withCredentials: true }
		);
  
		const data = response.data;
		const statusCode = response.status;
  
		dispatch(setProxyData({ proxyData: proxyData, statusCode: proxyStatusCode}));
	  } catch (err) {
		dispatch(setLoader(false));
  
		const errorData = err.response ? err.response.data : null;
		const errorStatusCode = err.response ? err.response.status : null;
		const errorMessage = err.message;
  
		dispatch(setError(errorMessage));
		dispatch(setProxyData({ proxyData: null, statusCode: errorStatusCode }));
	  }
	} else {
	dispatch(setProxyData({ proxyData: null, statusCode: null }));
	}
  };


export const updateExamScores = (examId, scores) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.put(
			`${REACT_APP_API_URL}/api/v1/exam/${examId}/scores`,
			scores,
			{ withCredentials: true }
		);

		dispatch(setExam(data.exam));
	} catch (err) {
		dispatch(setLoader(false));
		dispatch(setError(err.response.data.message));
	}
};
