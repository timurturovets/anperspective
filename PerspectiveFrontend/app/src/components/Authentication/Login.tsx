import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { request } from '../../request'
import { AuthContextConsumer } from '../../AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'

interface LoginPageState {
    notRegistered: Boolean,
    userNameErrors?: string[],
    passwordErrors?: string[]
}
export default class Login extends Component<any, LoginPageState> {
    constructor(props: any){
        super(props);
        this.state = {
            notRegistered: false,
            userNameErrors: undefined,
            passwordErrors: undefined
        };
    }

    render() {
        const { notRegistered, userNameErrors, passwordErrors } = this.state;
        return <AuthContextConsumer>
            {({setStatus}) =>
                notRegistered
                    ? <Navigate to="/register"/>
                    : <div className="m-auto text-center" style={{width: '50%'}}>
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
                            <button className="btn btn-sm btn-outline-primary"
                                    onClick={e => this.setState({notRegistered: true})}>
                                Нет аккаунта?
                            </button>
                        </form>
                    </div>
            }
            </AuthContextConsumer>
    }

    handleSubmit = 
        async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
         setStatus: (s:Boolean, r:string) => void) 
            : Promise<void> =>  {
        
        event.preventDefault();
        const form = (event.target as HTMLInputElement).form as HTMLFormElement;
        const formData = new FormData(form);

        await request('/api/auth/login', {
            method: 'POST',
            body: formData
        }).then(async response => {
            const result = await response.json();
            
            if(response.status === 200) {
                const token: string = result.token;
                const expirationTime: number = result.expirationTime;
                let now = new Date();
                now.setTime(now.getTime() + expirationTime * 1000);
                const expires = "expires=" + now.toUTCString();
                document.cookie = "token=" + token + ";" + expires + "; path=/";
                
                const role = result.role;
                setStatus(true, role);
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