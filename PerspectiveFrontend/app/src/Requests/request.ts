import axios, { AxiosResponse } from 'axios'
import { getJWTInfo, setJWTInfo } from './JWTLocalStorage'
import JWTInfo from '../Interfaces/JWTInfo'

const host = process.env.REACT_APP_API_URL;

const client = axios.create({
    baseURL: host
});

interface RequestData {
    method?: string,
    body?: FormData | string
}

export default function request(route: string, params?: RequestData) : Promise<AxiosResponse> {
        return client.request<any, AxiosResponse, FormData | string>({
            method: params?.method || 'GET',
            url: route,
            data: params?.body,
        });
}

function enableRequestInterceptor(token: string) {
    client.interceptors.request.use(config=>{
        if(!config.headers) return;
        console.log(`interceptor with token ${token.slice(0, 5)}... enabled`);
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    });
}

function enableResponseInterceptor() {
    client.interceptors.response.use(config=>{
        if(config.status === 401) {
            alert('401');
            window.location.href ="/"
        }
        return config;
    });
}

export function configureAuthentication(info?: JWTInfo) {
    enableResponseInterceptor();
    
    if(!info) {
        const token = getJWTInfo()?.token;
        if(token) enableRequestInterceptor(token);
        return;
    }
    const { token } = info;
    enableRequestInterceptor(token);
    setJWTInfo(info);
}