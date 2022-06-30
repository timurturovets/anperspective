import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

export default class HomeHeader extends Component{
    render(){ 
    
        return <>
            <h1 className="display-3 mb-0">Агентство новостей "Перспектива"</h1>
            <h6>Актуальные новости с 1984 года.</h6>
        </>
    }
}