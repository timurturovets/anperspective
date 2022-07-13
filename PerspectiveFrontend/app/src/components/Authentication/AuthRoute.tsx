import React, { Component, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContextConsumer } from '../../AuthContext'

interface AuthRouteProps {
    children: ReactNode | ReactNode[],
    fromUrl?: string,
    roles?: string[]
}

export default class AuthRoute extends Component<AuthRouteProps, any> {
    constructor(props: AuthRouteProps) {
        super(props);
    }
    
    render() {
        const roles = this.props.roles?.map(r=>r.toLowerCase());
        const { children, fromUrl } = this.props;
        
        let loginPageUrl = '/login';
        if(fromUrl) loginPageUrl += `?from=${fromUrl}`;
        
        return <AuthContextConsumer>
            {({isAuthenticated, role}) => {
                return isAuthenticated
                    ? !roles || roles.find(r => r === role.toLowerCase())
                        ? children
                        : <span className="text-center text-danger">
                            <h1>403</h1>
                            <h6>У вас нет доступа к этой странице.</h6>
                        </span>
                    : <Navigate to={loginPageUrl}/>
            }
            }
        </AuthContextConsumer>
    }   
}