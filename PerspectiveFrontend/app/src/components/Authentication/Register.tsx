import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { request } from '../../request'
import { AuthContextConsumer } from '../../AuthContext'

interface RegisterPageState{
    alreadyRegistered: Boolean,
    userNameErrors?: string[],
    passwordErrors?: string[]
}
export default class Register extends Component<any, RegisterPageState> {
    constructor(props: any){
        super(props);

        this.state = {
            alreadyRegistered: false,
            userNameErrors: undefined,
            passwordErrors: undefined
        };
    }

    render() {
        const { alreadyRegistered, userNameErrors, passwordErrors } = this.state;
        return <AuthContextConsumer>
            {({setStatus}) =>
                alreadyRegistered
                ? <Navigate to="/login" />
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
                            <div className="form-group mb-1">
                                <label>Подтвердите пароль</label>
                                <input className="form-control" type="text" name="passwordconfirmation"/>
                            </div>
                            <button className="btn btn-lg btn-outline-success mb-1"
                                    onClick={e => this.handleSubmit(e, setStatus)}>
                                Зарегистрироваться
                            </button><br />
                            <button className="btn btn-sm btn-outline-primary"
                                    onClick={e => this.setState({alreadyRegistered: true})}>
                                Уже зарегистрированы??
                            </button>
                        </form>
                    </div>
            }
        </AuthContextConsumer>
    }

    handleSubmit = 
        async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
         setStatus: (s: Boolean, r:string) => void) 
            : Promise<void> =>  {
        
        event.preventDefault();
        const form = (event.target as HTMLInputElement).form as HTMLFormElement;
        const formData = new FormData(form);

        await request('/api/auth/register', {
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