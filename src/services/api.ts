import axios from "axios";
import * as environmets from "../config/environments";

export const apiBackEnd = axios.create({
  baseURL: environmets.APP_BACKEND,
});

/* apiBackEnd.interceptors.request.use(async (config) => {
	const client = DefaultOAuth2ClientFactory.INSTANCE.get('GERENCIADOR');
	const token = await client.getAccessToken();
	const access_token = `Bearer ${token}`;
	config.headers['authorization'] = access_token;
	return config;
}); */
