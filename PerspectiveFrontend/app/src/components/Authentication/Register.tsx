import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { post } from '../../functions'

interface RegisterPageState{
    alreadyRegistered: Boolean
}
export default class Register extends Component<any, RegisterPageState> {
    constructor(props: any){
        super(props);

        this.state = {
            alreadyRegistered: false
        };
    }

    render() {
        return this.state.alreadyRegistered
        ? <Navigate to="/login" />
        : <form>
            <label>Электронная почта</label>
            <input type="text" name="email" />

            <label>Пароль</label>
            <input type="text" name="password" />
            
            <button className="btn btn-outline-success"
                onClick={e=>this.handleSubmit(e)}>

            </button>
            <button className="btn btn-outline-primary"
                onClick={e=>this.setState({alreadyRegistered: true})}>
                Уже есть аккаунт?
            </button>
        </form>
    }

    handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) : void => {

    }
}