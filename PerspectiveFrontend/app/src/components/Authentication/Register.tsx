import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import request from '../../Requests/request'
import { AuthContextConsumer } from '../../AuthContext'
import { configureAuthentication } from "../../Requests/request";

interface RegisterPageState{
    userNameErrors?: string[],
    passwordErrors?: string[]
}
export default class Register extends Component<any, RegisterPageState> {
    constructor(props: any){
        super(props);

        this.state = {
            userNameErrors: undefined,
            passwordErrors: undefined
        };
    }

    render() {
        const { userNameErrors, passwordErrors } = this.state;
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
                        <div className="form-group mb-1">
                            <label>Подтвердите пароль</label>
                            <input className="form-control" type="text" name="passwordconfirmation"/>
                        </div>
                        <button className="btn btn-lg btn-outline-success mb-1"
                                onClick={e => this.handleSubmit(e, setStatus)}>
                            Зарегистрироваться
                        </button><br />
                        <Link to="/login" className="btn btn-sm btn-outline-primary">
                            Уже есть аккаунт?
                        </Link>
                    </form>
                </div>
            }
        </AuthContextConsumer>
    }

    handleSubmit = 
        async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
         setStatus: (s: boolean, r:string) => void) 
            : Promise<void> =>  {
        
        event.preventDefault();
        const form = (event.target as HTMLInputElement).form as HTMLFormElement;
        const formData = new FormData(form);

        await request('/api/auth/register', {
            method: 'POST',
            body: formData
        }).then(response => {
            const result = response.data;
            
            if(response.status === 200) {
                const token = result.token;
                const expires = result.tokenLifeSpan;
                const role = result.role;

                setStatus(true, role);
                configureAuthentication({token, expires, role});

                const query = new URLSearchParams(window.location.search);
                if (!query.has('from')) return;
                window.location.href = query.get('from') as string;
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