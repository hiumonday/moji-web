import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const theme = {
	card: {
		styles: {
			variants: {
				filled: {
					blue: {
						background: "bg-[#5476b6]",
						color: "text-white",
						shadow: "shadow-blue-500/40",
					},
				},
			},
		},
	},
	button: {
		styles: {
			variants: {
				filled: {
					blue: {
						background: "bg-[#5476b6]",
						color: "text-white",
						shadow: "shadow-md shadow-blue-500/10",
						hover: "hover:shadow-lg hover:shadow-blue-500/20",
						focus: "focus:opacity-[0.85] focus:shadow-none",
						active: "active:opacity-[0.85] active:shadow-none",
					},
				},
			},
		},
	},
	chip: {
		styles: {
			variants: {
				filled: {
					red: {
						background: "bg-pink-300",
						color: "text-white",
					},
				},
			},
		},
	},
	list: {
		styles: {
			base: {
				list: {
					minWidth: "min-w-[180px]",
				},
				item: {
					disabled: {
						opacity: "opacity-100",
						cursor: "cursor-not-allowed",
						pointerEvents: "pointer-events-none",
						userSelect: "select-none",
						bg: "hover:bg-transparent focus:bg-transparent active:bg-transparent",
						color: "hover:text-blue-gray-500 focus:text-blue-gray-500 active:text-blue-gray-500",
					},
				},
			},
		},
	},
	select: {
		styles: {
			base: {
				container: {
					minWidth: "min-w-[100px]",
				},
			},
		},
	},
	textarea: {
		styles: {
			base: {
				container: {
					minWidth: "min-w-[150px]",
				},
			},
		},
	},
	checkbox: {
		styles: {
			base: {
				disabled: {
					opacity: "opacity-100",
					pointerEvents: "pointer-events-none",
				},

				input: {
					before: {
						opacity: "before:opacity-0",
					},
				},
			},
		},
	},
	carousel: {
		defaultProps: {
			prevArrow: ({ loop, handlePrev, firstIndex }) => {
				return (
					<button
						onClick={handlePrev}
						disabled={!loop && firstIndex}
						className="!absolute top-2/4 left-4 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-gray-800 hover:bg-white/10 active:bg-white/5 grid place-items-center">
						<ChevronLeftIcon
							strokeWidth={3}
							className="-ml-1 h-7 w-7"
						/>
					</button>
				);
			},
			nextArrow: ({ loop, handleNext, lastIndex }) => (
				<button
					onClick={handleNext}
					disabled={!loop && lastIndex}
					className="!absolute top-2/4 right-4 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-gray-800 hover:bg-white/10 active:bg-white/5 grid place-items-center">
					<ChevronRightIcon
						strokeWidth={3}
						className="ml-1 h-7 w-7"
					/>
				</button>
			),
		},
	},
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<ThemeProvider value={theme}>
		<Provider store={store}>
			<App />
		</Provider>
	</ThemeProvider>,
);
