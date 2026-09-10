import 'dotenv/config';
import './config/env.js';
import express from 'express';
import pool from './db/index.js';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.get('/api/health', async (req, res) => {
	try {
		const result = await pool.query('SELECT 1');

		return res.status(200).json({
			data: { status: 'ok', db: 'reachable', query_data: result.rows[0] },
		});
	} catch (error) {
		console.error(error);
		return res
			.status(503)
			.json({ error: { code: 'Service Unavailable', message: error.message } });
	}
});

app.listen(port, () => {
	console.log('App running on PORT: ', port);
});
