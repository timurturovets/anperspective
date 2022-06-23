import React, { Component } from 'react'
import { get } from '../functions'

interface PostInfo {
    header: string,
    authorName: string,
    rawHtml: string,
    timePosted: string
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
        const { header, authorName, rawHtml, timePosted } = info as PostInfo;
        
        return isLoading 
            ? <h3>Загрузка...</h3>
            : <>
                <h1>{header}</h1>
                <p>Опубликовал {authorName} {timePosted}</p>
                <div>{rawHtml}</div>
            </>
    }
    
    getInfo = async () => {
        const slug = this.props.location.slug;
        
        await get(`/api/posts/post/${slug}`).then(async response => {
           if(response.ok){
               const result = await response.json();
               this.setState({isLoading: false, info: result as PostInfo});
           } 
           if(response.status === 404) {
               alert('Пост не найден. Попробуйте снова.');
           }
        });
    }
}