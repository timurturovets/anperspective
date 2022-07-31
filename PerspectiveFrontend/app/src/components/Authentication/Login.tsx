import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import request  from '../../Requests/request'
import { setJWTInfo } from "../../Requests/JWTLocalStorage";
import { configureAuthentication} from "../../Requests/request";
import { AuthContextConsumer } from '../../AuthContext'

interface LoginPageState {
    userNameErrors?: string[],
    passwordErrors?: string[],
    fromUrl?: string | null
}

export default class Login extends Component<any, LoginPageState> {
    constructor(props: any){
        super(props);

        const query = new URLSearchParams(window.location.search);
        const fromUrl = query.get('from');
        
        this.state = {
            userNameErrors: undefined,
            passwordErrors: undefined,
            fromUrl
        };
    }

    render() {
        const { userNameErrors, passwordErrors, fromUrl } = this.state;
        
        let registerPageUrl = '/register';
        if(fromUrl) registerPageUrl += `?from=${fromUrl}`;
        
        return <AuthContextConsumer>
            {({setStatus}) =>
                <div className="m-auto text-center" style={{width: '50%'}}>
                    <form>
                        <div className="form-group my-1">
                            <label>Имя пользователя</label>
                            {userNameErrors
                                ? <span className="text-danger">
                                    {userNameErrors.map(err=><p>{err}</p>)}
                                </span>
                                : null}
                            <input className="form-control" type="text" name="username"/>
                        </div>
                        <div className="form-group mb-1">
                            <label>Пароль</label>
                            {passwordErrors
                                ? <span className="text-danger">
                                    {passwordErrors.map(err=><p>{err}</p>)}
                                </span>
                                : null}
                            <input className="form-control" type="text" name="password"/>
                        </div>
                        <button className="btn btn-lg btn-outline-success mb-1"
                                onClick={e => this.handleSubmit(e, setStatus)}>
                            Войти
                        </button><br />
                        <Link to={registerPageUrl} className="btn btn-sm btn-outline-primary">
                            Нет аккаунта?
                        </Link>
                    </form>
                </div>
            }
            </AuthContextConsumer>
    }

    handleSubmit = 
        async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
         setStatus: (s:boolean, r:string) => void) 
            : Promise<void> =>  {
        
        event.preventDefault();
        const form = (event.target as HTMLInputElement).form as HTMLFormElement;
        const formData = new FormData(form);

        await request('/api/auth/login', {
            method: 'POST',
            body: formData
        }).then(response => {
            const result = response.data;
            
            if(response.status === 200) {
                const token = result.token,
                      expires = result.tokenLifeSpan,
                      role = result.role;
                
                setStatus(true, role);
                configureAuthentication({token, expires, role});
                
                const { fromUrl } = this.state;
                if (!fromUrl) return;
                window.location.replace(fromUrl);
            }
            
            if (response.status === 400) {
                const errors = result.errors;
                this.setState({
                    userNameErrors: errors.UserName,
                    passwordErrors: errors.Password
                });
            }
        });
    }
}