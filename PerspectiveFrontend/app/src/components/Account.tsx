import React, { Component } from 'react'
import request from "../Requests/request";
import { setJWTInfo } from "../Requests/JWTLocalStorage";
import AuthRoute from './Authentication/AuthRoute';
import Loading from "./Util/Loading";
import UserInfo from "../Interfaces/UserInfo";
import { AxiosError } from "axios";
import JWTInfo from "../Interfaces/JWTInfo";

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
                        <input className="form-control form-control-sm w-25" type="text" defaultValue={user?.userName} 
                           onChange={this.handleNameChange}/>
                        {!isSaved && <><b>Есть несохранённые изменения.</b><br /></>}
                        <button className="btn btn-outline-success" 
                            onClick={this.handleSave} disabled={isSaved}>Сохранить</button>
                    </div>
                </>
            }
        </AuthRoute>
    }
    
    fetchData = async () => {
        await request('/api/account/info').then(response => {
            const result = response.data as UserInfo;
            this.setState({
                isLoading: false,
                user: result
            });
            console.log(this.state.user);
        });
    }
    
    handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                userName: e.target.value
            } as UserInfo,
            isSaved: false
        });
    }
    
    handleSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        
        const { user } = this.state;
        console.log(user);
        if(!user) return;
        
        this.setState({
            isSaved: false,
            message: undefined
        });
        
        const { userName } = user;
        
        const fd = new FormData();
        fd.append('newUserName', userName);
        
        await request('/api/account/change-username',{
            method: 'PUT',
            body: fd
        })
            .then(response=> {
                const jwtInfo = response.data as JWTInfo;
                setJWTInfo(jwtInfo);
                this.setState({
                    isSaved: true,
                    message: `Имя успешно изменено на ${userName}`
                });
        })
            .catch((err: AxiosError)=> {
           if(err.response?.status === 409) {
               this.setState({
                   isSaved: false,
                   message: `Имя ${userName} уже занято, попробуйте другое.`
               });
           }
        });
    }
}