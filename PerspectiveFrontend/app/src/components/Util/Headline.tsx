import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { HeadlineData } from './Feed'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles.css'

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
        
        return <Link to={`/post?s=${slug}`} className="headline">
                <div className="d-flex flex-row">
                    <hr />
                    <img src={url} alt="" style={{height: "100%"}} />
                    <div className="d-flex flex-column">
                        <h3>{header}</h3>
                        <h5>Опубликовал {author} {timePosted}</h5>
                    </div>
                </div>
                </Link>
    }
}