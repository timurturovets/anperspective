import React, { Component, ReactNode } from 'react'
import Navbar from './Navbar'


interface LayoutProps {
    children: ReactNode
}
export default class Layout extends Component<LayoutProps, any> {
    constructor(props: LayoutProps) {
        super(props);
    }

    render() {
        return <>
            <Navbar />
            {this.props.children}
            
        </>
    }
}