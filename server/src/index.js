import 'dotenv/config';
import './config/env.js';
import express from 'express';
import pool from './db/index.js';
import errorHandler from './middleware/errorHandler.js';
import AppError from './middleware/Errors/appError.js';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.get('/api/health', async (req, res) => {
	let result;
	try {
		result = await pool.query('SELECT 1');
	} catch (err) {
		throw new AppError(503, 'SERVICE_UNAVAILABLE', err.message);
	}

	return res.status(200).json({
		data: { status: 'ok', db: 'reachable', query_data: result.rows[0] },
	});
});

app.use(errorHandler);

app.listen(port, () => {
	console.log('App running on PORT: ', port);
});
