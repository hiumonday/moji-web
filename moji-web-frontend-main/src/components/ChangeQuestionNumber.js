import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

const ChangeQuestionNumber = ({
	questionRef,
	isOpen,
	setIsOpen,
	setQuestionRef,
	changeQuestionNumber,
}) => {
	const [questionNumber, setQuestionNumber] = useState("");

	useEffect(() => {
		setQuestionNumber(questionRef?.questionNumber);
	}, [questionRef]);

	return (
		<Dialog
			open={isOpen}
			scroll="body"
			className="!w-screen"
			fullWidth={true}>
			<div className="p-4">
				<DialogTitle className="text-center">
					Change Question Serial Number
				</DialogTitle>
				<DialogContent className="m-4 flex justify-center items-center">
					<div className="border border-solid border-gray-700 py-2 px-1 sm:pl-5 rounded bg-gray-100 flex items-center">
						<FormatListNumberedIcon className="text-gray-600" />
						<input
							type="number"
							required={true}
							value={questionNumber}
							onChange={(e) => setQuestionNumber(e.target.value)}
							placeholder="Question serial number"
							className="flex-1 w-40 sm:w-60 md:w-80 ml-3 outline-none bg-transparent placeholder:text-gray-600"
						/>
					</div>
				</DialogContent>
				<DialogActions className="mt-4 text-white">
					<button
						onClick={() => {
							setIsOpen(false);
							setQuestionNumber("");
							setQuestionRef(undefined);
						}}
						className="bg-blue-gray-400 hover:bg-blue-gray-500 py-2 rounded-lg w-24 text-center text-neutral-50  transition duration-200 font-semibold">
						Cancel
					</button>
					<button
						disabled={
							!questionNumber ||
							Number(questionNumber) ===
								Number(questionRef?.questionNumber)
						}
						onClick={() => changeQuestionNumber(questionNumber)}
						className=" border-blue-gray-400 text-blue-gray-400 hover:text-blue-gray-500 hover:border-blue-gray-500 hover:bg-blue-gray-200 border-solid border py-2 rounded-lg w-24 text-center transition duration-200 box-border">
						Change
					</button>
				</DialogActions>
			</div>
		</Dialog>
	);
};

export default ChangeQuestionNumber;
