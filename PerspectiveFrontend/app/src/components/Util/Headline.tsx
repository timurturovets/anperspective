import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import HeadlineData from '../Interfaces/HeadlineData'

export interface HeadlineProps {
    data: HeadlineData
}

export default class Headline extends Component<HeadlineProps, any> {
    constructor(props: HeadlineProps){
        super(props);
    }
    
    render() {
        const { timePosted, authorName, header, slug, imageLocation } = this.props.data;
        
        const url = `${process.env.REACT_APP_API_URL}/${imageLocation}`;
        
        return <Link to={`/post?s=${slug}`} className="headline">
                <div className="d-flex flex-row" style={{height: '100px'}}>
                    <hr />
                    <img src={url} alt="" className="headline-img" />
                    <div className="ml-5 d-flex flex-column">
                        <h3>{header}</h3>
                        <h5>Опубликовал {authorName} {timePosted}</h5>
                    </div>
                </div>
                </Link>
    }
}