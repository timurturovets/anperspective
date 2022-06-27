import React, { Component } from 'react'

export default class Footer extends Component {

    render() {
        return <>
            <hr />
            <div className="d-flex flex-row">
            <div className="d-flex flex-column" style={{flex: 5}}>
                <h6>АН "Перспектива"</h6>
                <p>Работаем с 1984 года.</p>
            </div>
        </div>
        </>
    }
}