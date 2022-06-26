import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { request } from '../../request'
import { AuthContextConsumer } from '../../AuthContext'

interface RegisterPageState{
    alreadyRegistered: Boolean
}
export default class Register extends Component<any, RegisterPageState> {
    constructor(props: any){
        super(props);

        this.state = {
            alreadyRegistered: false
        };
    }

    render() {
        return <AuthContextConsumer>
            {({setStatus}) =>
                this.state.alreadyRegistered
                ? <Navigate to="/login" />
                : <form>
                <label>Электронная почта</label>
                <input type="text" name="email" />

                <label>Пароль</label>
                <input type="text" name="password" />

                <button className="btn btn-outline-success"
                onClick={e=>this.handleSubmit(e, setStatus)}>

                </button>
                <button className="btn btn-outline-primary"
                onClick={e=>this.setState({alreadyRegistered: true})}>
                Уже есть аккаунт?
                </button>
                </form>
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