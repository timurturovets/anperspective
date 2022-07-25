﻿import React, { Component } from 'react'
import request from '../Requests/request'

export interface PostInfo {
    postId: string,
    header: string,    
    timePosted: string,
    authorName: string,
    rawHtml: string,
    slug: string,
    imageLocation: string
}

interface PostState {
    isLoading: Boolean,
    info?: PostInfo
}

export default class Post extends Component<any, PostState> {
    constructor(props: any){
        super(props);
        
        this.state = {
            isLoading: true,
            info: undefined
        }
    }
    
    componentDidMount() {
        this.getInfo();
    }
    
    render() {
        const { isLoading, info } = this.state;
        
        return isLoading 
            ? <h3>Загрузка...</h3>
            : <>
                <h1>{info?.header}</h1>
                <p>Опубликовал {info?.authorName} {info?.timePosted}</p>
                <div dangerouslySetInnerHTML={{__html: info?.rawHtml || ""}}></div>
            </>
    }
    
    getInfo = async () => {
        const query = new URLSearchParams(window.location.search);
        if(!query.has('s')){
            window.location.href="/";
            return;
        }
        const slug = query.get('s');
        await request(`/api/posts/post/${slug}`).then(async response => {
           if(response.status === 200){
               const result = response.data;
               this.setState({isLoading: false, info: result as PostInfo});
           } 
           if(response.status === 404) {
               alert('Пост не найден. Попробуйте снова.');
           }
        });
    }
}