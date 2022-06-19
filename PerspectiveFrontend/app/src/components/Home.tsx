import React, { Component } from 'react'
import HomeHeader from './Util/HomeHeader'

export default class Home extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <>
            <HomeHeader />
        </>
    }
}