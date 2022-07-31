import React, { Component } from 'react'
import Headline  from './Headline'
import Loading from './Loading'
import HeadlineData from '../../Interfaces/HeadlineData'
import request from '../../Requests/request'

interface FeedState {
    isLoading: boolean,
    message?: string,
    news: HeadlineData[]
}

export default class Feed extends Component<any, FeedState> {
    constructor(props: any){
        super(props);
        
        this.state = {
            isLoading: true,
            message: undefined,
            news: []
        }
    }
    componentDidMount(){
        this.getPosts();
    }
    render() {
        const { isLoading, message, news } = this.state;
        console.log(`pog: ${news} pog`);
        return isLoading
            ? <Loading withText />
            : <>
                {message && <b>{message}</b>}
                {news.map(n => <Headline key={n.postId} data={n} />)}
                </>
    }
    
    getPosts = async () => {
        await request('/api/posts/all').then(response => {
            if(response.status === 204) {
                this.setState({isLoading: false, news: [], message:"Новостей пока нет."});
                return;
            }
            const result = response.data;
            this.setState({ isLoading: false, news: result });
        }).catch(err=> {
            this.setState({
                message: `Произошла непредвиденная ошибка. Попробуйте перезайти на сайт. [${err.response.status}]`
            });
        });
    }
}