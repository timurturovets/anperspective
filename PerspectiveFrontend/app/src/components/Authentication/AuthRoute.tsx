import React, { Component, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContextConsumer } from '../../AuthContext'

interface AuthRouteProps {
    children: ReactNode | ReactNode[]
}

export default class AuthRoute extends Component<AuthRouteProps, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <AuthContextConsumer>
            {({isAuthenticated}) => 
                isAuthenticated
                    ? this.props.children
                    : <Navigate to="/login" />
            }
        </AuthContextConsumer>
    }
}