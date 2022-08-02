import axios, {Axios, AxiosError, AxiosResponse} from 'axios'
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
let id: number;
export function enableRequestInterceptor(token: string) {
    client.interceptors.request.eject(id);
    id = client.interceptors.request.use(config=>{
        if(!config.headers) return;
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    });
}

export function configureAuthentication(info?: JWTInfo) {
    if(!info) {
        const token = getJWTInfo()?.token;
        if(token) enableRequestInterceptor(token);
        return;
    }
    const { token } = info;
    enableRequestInterceptor(token);
    setJWTInfo(info);
}