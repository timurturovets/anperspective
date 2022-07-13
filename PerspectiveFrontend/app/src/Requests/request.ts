import axios, {AxiosResponse} from 'axios'

const host = process.env.REACT_APP_API_URL;

export const client = axios.create({
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