import 'dotenv/config';
import pg from 'pg';
import { Pool } from 'pg';

const connectionString = process.env.DB_URL;

const pool = new Pool({ connectionString, pipeline: true });

export default pool;