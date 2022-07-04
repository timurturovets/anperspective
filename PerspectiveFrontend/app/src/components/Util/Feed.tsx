import React, { Component } from 'react'
import Headline  from './Headline'
import Loading from './Loading'
import { request } from '../../request'

export interface HeadlineData {
    postId: string,
    timePosted: string,
    header: string,
    slug: string,
    author: string, 
    imageLocation: string
}

interface FeedState {
    isLoading: Boolean,
    news: HeadlineData[]
}

export default class Feed extends Component<any, FeedState> {
    constructor(props: any){
        super(props);
        
        this.state = {
            isLoading: true,
            news: []
        }
    }
    componentDidMount(){
        this.getPosts();
    }
    render() {
        const { isLoading, news } = this.state;
        return isLoading
            ? <Loading withText />
            : news.map(n => <Headline key={n.postId} data={n} /> );
    }
    
    getPosts = async () => {
        await request('/api/posts/all').then(async response => {
           if (response.ok) {
               const result = await response.json();
               this.setState({ isLoading: false, news: result });
           }
           else alert(`Произошла ошибка. Перезайдите на сайт и попробуйте снова. [${response.status}]`);
        });
    }
}