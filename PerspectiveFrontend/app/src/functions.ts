const host = process.env.REACT_APP_API_URL;

export function get(route: string) : Promise<Response> {
    const url = host + route;
    return fetch(url);
}

export function post(route: string, options?: RequestInit) : Promise<Response> {
    const url = host + route;
    return fetch(url, {
        ...options,
        method: 'POST'
    });
}