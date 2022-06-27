import React, { Component, ReactNode } from 'react'
import NavigationHeader from './Util/NavigationHeader'
import '../styles.css'
import Footer from "./Util/Footer";

interface LayoutProps {
    children: ReactNode
}
export default class Layout extends Component<LayoutProps, any> {
    constructor(props: LayoutProps) {
        super(props);
    }

    render() {
        return <>
            <NavigationHeader />
            <div className="layout-container">
                {this.props.children}
            </div>
            <Footer />
        </>
    }
}