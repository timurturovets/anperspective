import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import request from '../../Requests/request'
import { AuthContextConsumer } from '../../AuthContext'
import { configureAuthentication } from "../../Requests/request";
import {AxiosError} from "axios";

interface RegisterPageState{
    errors?: string[]
}
export default class Register extends Component<any, RegisterPageState> {
    constructor(props: any){
        super(props);

        this.state = {
            errors: undefined
        };
    }

    render() {
        const { errors } = this.state;
        return <AuthContextConsumer>
            {({setStatus}) =>
                <div className="m-auto text-center" style={{width: '50%'}}>
                    {errors
                        ? <span className="text-danger">
                            {errors.map(e=><p>{e}</p>)}
                        </span>
                        : null
                    }
                    <form>
                        <div className="form-group my-1">
                            <label>Имя пользователя</label>
                            <input className="form-control" type="text" name="username"/>
                        </div>
                        <div className="form-group mb-1">
                            <label>Пароль</label>
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
        
        this.setState({
            errors: undefined
        });
        
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
        }).catch((err: AxiosError)=> {
            if(err.response?.status === 400) {
                const result: any = err.response?.data;
                const errors = result.errors;
                
                const stateErrors: string[] = [];
                for(const e in errors) {
                    stateErrors.push(errors[e][0]);
                }
                
                this.setState({
                    errors: stateErrors
                });
            }
            if(err.response?.status === 409) {
                this.setState({
                    errors: ['Этот ник уже занят. Попробуйте другой.']
                });
            }
        });
    }
}