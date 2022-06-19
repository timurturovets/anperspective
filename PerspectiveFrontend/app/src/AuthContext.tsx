import React, { ReactNode, Component } from 'react'

const { Provider, Consumer } = React.createContext({
    isAuthenticated: false,
    setStatus: (status: Boolean) => { }
});

interface AuthContextProviderProps {
    children: ReactNode | ReactNode[] 
}

export class AuthContextProvider extends Component<AuthContextProviderProps, any> {
    constructor(props: AuthContextProviderProps){
        super(props);

        this.state = {
            isAuthenticated: false
        }
    }

    setStatus = (status: Boolean) => {
        this.setState({ isAuthenticted: status })
    }

    render() {
        return <Provider value={{isAuthenticated: this.state.isAuthenticated, setStatus: this.setStatus}}>
            {this.props.children}
        </Provider>
    }
}

export { Consumer as AuthContextConsumer }