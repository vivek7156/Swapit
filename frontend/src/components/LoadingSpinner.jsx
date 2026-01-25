import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md" }) => {
	const sizeMap = {
		sm: "w-5 h-5",
		md: "w-8 h-8",
		lg: "w-12 h-12"
	};

	return (
		<div className="flex items-center justify-center">
			<motion.div
				className={`${sizeMap[size] || sizeMap.md} border-2 border-white/20 border-t-green-500 rounded-full`}
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
	);
};

export default LoadingSpinner;