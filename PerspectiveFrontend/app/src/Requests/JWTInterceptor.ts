import { client } from './request'

export default function enableInterceptor(token: string) {
    client.interceptors.request.use(config => {
        if(!config.headers) return;
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    }, err => Promise.reject(err)
    );
}