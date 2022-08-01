import React, { Component } from 'react'
import request from "../Requests/request";
import AuthRoute from './Authentication/AuthRoute';
import Loading from "./Util/Loading";
import UserInfo from "../Interfaces/UserInfo";
import {AxiosError, AxiosResponse} from "axios";

interface AccountState {
    isLoading: boolean,
    user?: UserInfo,
    isSaved: boolean,
    message?: string
}
export default class Account extends Component<any, AccountState> {
    constructor(props: any){
        super(props);
        
        this.state = {
            isLoading: true,
            user: undefined,
            isSaved: true,
            message: undefined
        };
    }
    
    componentDidMount() {
        this.fetchData();
    }
    render() {
        const { isLoading, user, isSaved, message } = this.state;
        
        return <AuthRoute>
            { isLoading
                ? <Loading withText />
                : <>
                    <h1 className="text-center display-1">Личный кабинет</h1>
                    {message && <b>{message}</b>}
                    <div className="form-group">
                        <h3>Ваш никнейм</h3>
                        <input className="form-control form-control-sm" type="text" defaultValue={user?.name} 
                           onChange={this.handleNameChange}/>
                        {!isSaved && <><b>Есть несохранённые изменения.</b><br /></>}
                        <button className="btn btn-outline-success" 
                            onChange={this.handleSave} disabled={isSaved}>Сохранить</button>
                    </div>
                </>
            }
        </AuthRoute>
    }
    
    fetchData = async () => {
        await request('/api/account/info').then(response => {
            const result = response.data as UserInfo;
            console.log(result);
            this.setState({
                isLoading: false,
                user: result
            });
        });
    }
    
    handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                name: e.target.value
            } as UserInfo,
            isSaved: false
        });
    }
    
    handleSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        
        const { user } = this.state;
        if(!user) return;
        
        this.setState({
            isSaved: false,
            message: undefined
        });
        
        const { name } = user;
        
        await request('/api/account/change-username',{
            method: 'PUT',
            body: JSON.stringify({newUserName:name})
        })
            .then(response=> {
            this.setState({
                isSaved: true,
                message: `Имя успешно изменено на ${name}`
            });
        })
            .catch((err: AxiosError)=> {
           if(err.response?.status === 409) {
               this.setState({
                   isSaved: false,
                   message: `Имя ${name} уже занято, попробуйте другое.`
               });
           }
        });
    }
}