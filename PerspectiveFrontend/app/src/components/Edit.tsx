import React, { Component } from 'react'

export default class Edit extends Component {
    constructor(props: any){
        super(props);
    }
    
    componentDidMount() {
        this.checkForAuthorization();
    }
    render(){
        return <>
            
        </>
    }
    
    checkForAuthorization = async () => {
        
    }
}