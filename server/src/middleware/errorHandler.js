import AppError from './Errors/appError.js';

const errorHandler = async (err, req, res, next) => {
	console.log(err);

	if (err instanceof AppError) {
		return res.status(err.status).json({
			error: { code: err.code, message: err.message, fields: err.fields },
		});
	}

	return res.status(500).json({
		error: {
			code: 'INTERNAL_ERROR',
			message: 'Something went wrong',
			fields: null,
		},
	});
};

export default errorHandler;
