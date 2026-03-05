export const getConfiguration = () => ({
	nodeEnv: process.env.NODE_ENV,
	port: process.env.PORT,
	corsOriginFrontendUrl: process.env.CORS_ORIGIN_FRONTEND_URL,
});
