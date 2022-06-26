import React, { ReactNode, Component } from 'react'

const { Provider, Consumer } = React.createContext({
    isAuthenticated: false,
    role: "Default",
    setStatus: (status: Boolean, role: string) => { }
});

interface AuthContextProviderProps {
    children: ReactNode | ReactNode[] 
}

export class AuthContextProvider extends Component<AuthContextProviderProps, any> {
    constructor(props: AuthContextProviderProps){
        super(props);

        this.state = {
            isAuthenticated: false,
            role: "Default"
        }
    }

    setStatus = (status: Boolean, role: string) => {
        this.setState({ isAuthenticated: status, role: role })
    }

    render() {
        const { isAuthenticated, role } = this.state;
        return <Provider value={{isAuthenticated: isAuthenticated, role: role, setStatus: this.setStatus}}>
            {this.props.children}
        </Provider>
    }
}

export { Consumer as AuthContextConsumer }