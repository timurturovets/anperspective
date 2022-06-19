import React, { Component, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContextConsumer } from '../AuthContext'
import LoginPage from './LoginPage'

interface AuthRouteProps {
    element: ReactNode
}

export default class AuthRoute extends Component<AuthRouteProps, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <AuthContextConsumer>
            {({isAuthenticated}) => 
                isAuthenticated
                    ? this.props.element
                    : <Navigate to="/login" />
            }
        </AuthContextConsumer>
    }
}