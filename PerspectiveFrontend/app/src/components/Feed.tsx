import React, { Component } from 'react'
import Headline  from './Util/Headline'

export interface HeadlineData {
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
        
    }
    render() {
        const { isLoading, news } = this.state;
        return isLoading
            ? <h3>Загрузка...</h3>
            : news.map(n=><Headline data={n} /> );
    }
    
    
}