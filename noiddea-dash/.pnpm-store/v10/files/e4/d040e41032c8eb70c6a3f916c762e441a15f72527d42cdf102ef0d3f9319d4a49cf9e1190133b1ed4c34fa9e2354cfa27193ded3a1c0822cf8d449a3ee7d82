import "./_runtime_warn.mjs";
import { toResponse } from "h3";
const errorHandler = (error, event) => {
	if (error.status !== 404) {
		console.error(error);
	}
	return toResponse(error, event);
};
export default errorHandler;
