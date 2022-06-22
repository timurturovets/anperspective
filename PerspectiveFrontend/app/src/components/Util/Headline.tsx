import React, { Component } from 'react'
import { HeadlineData } from '../Feed'

interface HeadlineProps {
    data: HeadlineData
}
export default class Headline extends Component<HeadlineProps, any> {
    constructor(props: HeadlineProps){
        super(props);
    }
    
    render() {
        const { timePosted, author, header, slug, imageLocation } = this.props.data;
        
        const url = `${process.env.REACT_APP_API_URL}/${imageLocation}`;
        return <div className="d-flex flex-row">
            <hr />
            <img src={url} alt="" style={{height: "100%"}} />
            <div className="d-flex flex-column">
                <h3>{header}</h3>
                <h5>Опубликовано {timePosted} автором {author}</h5>
            </div>
        </div>
    }
    
}