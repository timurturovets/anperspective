interface JWTInfo {
    token: string,
    expires: number,
    role: string
}

export function setJWTInfo(info: JWTInfo) : void {
    console.log(info);
    const expires = new Date();
    expires.setTime(expires.getTime() + info.expires * 1000);
    const item: JWTInfo = {
        token: info.token,
        expires: expires.getTime(),
        role: info.role
    };
    localStorage.setItem('jwt', JSON.stringify(item));
}

export function getJWTInfo() : JWTInfo | undefined {
    const item = localStorage.getItem('jwt');
    if(!item) return undefined;
    
    const jwt = JSON.parse(item) as JWTInfo;
    const now = new Date().getTime();
    if(now < jwt.expires) return jwt;
    
    localStorage.removeItem('jwt');
    return undefined;
}