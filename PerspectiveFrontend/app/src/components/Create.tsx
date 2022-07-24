import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import AuthRoute from './Authentication/AuthRoute'
import request from '../Requests/request'

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
        return <AuthRoute roles={["editor", "admin"]}>
            {submitted
                ? success
                    ? <Navigate to={`/edit/post?id=${postId}`} />
                    : <span className="text-danger">
                        {errors.map(err=><b>{err}</b>)}
                      </span>
                : <form>
                    <h1 className="text-center">Создание поста</h1>
                    <input type="text" className="form-control" placeholder="Заголовок" name="header" />
                    <label>Выберите картинку-описание</label>
                    <input type="file" className="form-control" name="image" />
                    <input type="submit" className="btn btn-lg btn-outline-primary"
                           onClick={e => this.handleCreate(e)} value="Создать пост" />
                </form>
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
                    this.setState({submitted: true, success: true, postId: id});
                }     
        });
    }
}