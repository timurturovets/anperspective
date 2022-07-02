import React, { Component } from 'react'
import { request } from '../request'
import { PostInfo } from './Post'

interface EditPostState {
    isLoading: Boolean,
    post?: PostInfo
}
export default class EditPost extends Component<any, EditPostState> {
    constructor(props: any){
        super(props);
        
        this.state = {
            isLoading: true,
            post: undefined
        };
    }
    
    componentDidMount() {
        this.getPost();
    }
    
    render() {
        return <></>
    }
    
    getPost = async () => {
        const query = new URLSearchParams(window.location.search);
        if(!query.has('id')) {
            alert('Отсутствует ID поста в строке запроса. Попробуйте перезайти на страницу.');
            window.location.href = "/";
        }
        
        const id = query.get('id');
        await request('/api/post/')
    }
}