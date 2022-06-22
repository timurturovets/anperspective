import React, { Component } from 'react'
import HomeHeader from './Util/HomeHeader'
import Feed from './Feed'
import Footer from './Footer'

export default class Home extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <>
            <HomeHeader />
            <Feed />
            <Footer />
        </>
    }
}