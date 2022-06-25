import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { post } from '../../functions'

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
        return this.state.alreadyRegistered
        ? <Navigate to="/login" />
        : <form>
            <label>Электронная почта</label>
            <input type="text" name="email" />

            <label>Пароль</label>
            <input type="text" name="password" />
            
            <button className="btn btn-outline-success"
                onClick={e=>this.handleSubmit(e)}>

            </button>
            <button className="btn btn-outline-primary"
                onClick={e=>this.setState({alreadyRegistered: true})}>
                Уже есть аккаунт?
            </button>
        </form>
    }

    handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) : void =>  {
        e.preventDefault();
        const form = (e.target as HTMLInputElement).form as HTMLFormElement;
        const formData = new FormData(form);

        post('/api/auth/login', {
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
            }
        });
    }
}