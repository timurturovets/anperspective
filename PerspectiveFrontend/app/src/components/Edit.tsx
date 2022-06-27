import React, { Component } from 'react'
import { request } from '../request'

interface EditState {
    isAuthorized: Boolean
}
export default class Edit extends Component<any, EditState> {
    constructor(props: any){
        super(props);
        
        
    }
    
    componentDidMount() {
        this.checkForAuthorization();
    }
    render(){
        const { isAuthorized } = this.state;
        return !isAuthorized
            ? <p>Загрузка</p>
            : null
    }
    
    checkForAuthorization = async () => {
        await request('/api/auth/get-role').then(async response => {
            if(response.status === 401 || response.status === 409) {
                window.location.href = "/";
                return;
            }
            
            const role = (await response.json()).toLowerCase();
            if(role !== "admin" && role !== "editor") {
                window.location.href = "/";
                return;
            }
        });
    }
}