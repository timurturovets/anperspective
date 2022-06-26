const host = process.env.REACT_APP_API_URL;

export const request = (route: string, options?: RequestInit) : Promise<Response> => {
    const url = host + route;
    return fetch(url, options);
}