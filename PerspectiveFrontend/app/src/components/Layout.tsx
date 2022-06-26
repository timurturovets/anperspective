import React, { Component, ReactNode } from 'react'
import NavigationHeader from './NavigationHeader'

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
            {this.props.children}
        </>
    }
}