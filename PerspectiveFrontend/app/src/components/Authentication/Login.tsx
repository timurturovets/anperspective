import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { request } from '../../request'
import { AuthContextConsumer } from '../../AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'

interface LoginPageState {
    notRegistered: Boolean
}
export default class Login extends Component<any, LoginPageState> {
    constructor(props: any){
        super(props);
        this.state = {
            notRegistered: false
        };
    }

    render() {
        return <AuthContextConsumer>
            {({setStatus}) =>
                this.state.notRegistered
                    ? <Navigate to="/register"/>
                    : <div className="m-auto text-center" style={{width: '50%'}}>
                        <form>
                            <label>Электронная почта</label>
                            <input className="form-control" type="text" name="email"/>
    
                            <label>Пароль</label>
                            <input className="form-control" type="text" name="password"/>
    
                            <button className="btn btn-lg btn-outline-success"
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
            if(response.status === 200) {
                const result = await response.json();

                const token: string = result.token;
                const expirationTime: number = result.expirationTime;
                let now = new Date();
                now.setTime(now.getTime() + expirationTime * 1000);
                const expires = "expires=" + now.toUTCString();
                document.cookie = "token=" + token + ";" + expires + "; path=/";
                
                const role = result.role;
                setStatus(true, role);
            }
        });
    }
}