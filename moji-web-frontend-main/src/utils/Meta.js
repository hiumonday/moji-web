import { Helmet } from "react-helmet-async";

const Meta = ({ title, description }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta
				name="description"
				content={
					!description ? "Nền tảng tự học SAT tích hợp AI" : description
				}
			/>
		</Helmet>
	);
};
export default Meta;
