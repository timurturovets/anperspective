import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import AuthRoute from './Authentication/AuthRoute'
import request from '../Requests/request'
import {AxiosError} from "axios";

interface CreateState {
    submitted: Boolean,
    success: Boolean,
    postId: string,
    errors: string[]
}

export default class Create extends Component<any, CreateState> {
    constructor(props: any){
        super(props);
        
        this.state = {
            submitted: false,
            success: false,
            postId: "",
            errors: []
        }
    }
    
    render() {
        const { submitted, success, postId, errors } = this.state;
        
        const form: JSX.Element = <form>
            <input type="text" className="form-control" placeholder="Заголовок" name="header" />
            <label>Выберите картинку-описание</label>
            <input type="file" className="form-control" name="image" />
            <input type="submit" className="btn btn-lg btn-outline-primary"
                   onClick={e => this.handleCreate(e)} value="Создать пост" />
        </form>;
        
        return <AuthRoute roles={["editor", "admin"]} fromUrl="/create">
            <h1 className="text-center">Создание поста</h1>
            {submitted
                ? success
                    ? <Navigate to={`/edit/post?id=${postId}`} />
                    : <>
                        <span className="text-danger">
                        {errors.map(err=><b>{err}</b>)}
                      </span>
                    {form}
                    </>
                : form
            }
        </AuthRoute>
    }
    
    handleCreate = async (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        
        const form = (e.target as HTMLInputElement).form as HTMLFormElement;
        const formData = new FormData(form);
        
        await request('/api/edit/create',{
            method: 'POST',
            body: formData
            }).then(response => {
                if(response.status === 200) {
                    const id = response.data;
                    this.setState({
                        submitted: true, 
                        success: true, 
                        postId: id
                    });
                }     
        }).catch((err: AxiosError) => {
            if(err.response?.status === 400) {
                const result: any = err.response.data;
                const errors = result.errors;
                
                const stateErrors: string[] = [];
                for(const err in errors) {
                    stateErrors.push(errors[err][0]);
                }
                
                this.setState({
                    submitted: true,
                    success: false,
                    errors: stateErrors
                });
            }
        });
    }
}