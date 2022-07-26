import React, { Component } from 'react'
import Headline  from './Headline'
import Loading from './Loading'
import HeadlineData from '../Interfaces/HeadlineData'
import request from '../../Requests/request'

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
        await request('/api/posts/all').then(response => {
           if (response.status === 200) {
               const result = response.data;
               this.setState({ isLoading: false, news: result });
           }
           else alert(`Произошла ошибка. Перезайдите на сайт и попробуйте снова. [${response.status}]`);
        }).catch(err=>console.log(err));
    }
}