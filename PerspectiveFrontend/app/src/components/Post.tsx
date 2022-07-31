import React, { Component } from 'react'
import request from '../Requests/request'
import PostInfo from '../Interfaces/PostInfo'

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
        
        const imgUrl = `${process.env.REACT_APP_API_URL}/${info?.imageLocation}`;
        return isLoading 
            ? <h3>Загрузка...</h3>
            : <>
                <img src={imgUrl} alt={info?.header} style={{height:'500px'}} />
                <h1>{info?.header}</h1>
                <p>Опубликовал {info?.authorName} {info?.timePosted}</p>
                <div dangerouslySetInnerHTML={{__html: info?.rawHtml || ""}} />
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