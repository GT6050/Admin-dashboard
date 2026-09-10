import 'dotenv/config';

const required = ['PORT', 'DB_URL', 'CLIENT_URL'];
const missing = required.filter((item) => {
	return !process.env[item];
});
if (missing.length) {
	console.error(`Missing required env variables: ${missing.join(', ')}`);
	process.exit(1);
}
