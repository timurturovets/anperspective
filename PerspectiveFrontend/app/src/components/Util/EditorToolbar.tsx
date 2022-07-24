import React, { Component } from 'react'

export default class EditorToolbar extends Component {
    constructor(props: any){
        super(props);
    }
    
    render() {
        return <div id="editor-toolbar">
            <select className="ql-header" defaultValue="" onChange={e => e.persist()}>
                <option value="1" />
                <option value="2" />
                <option selected />
            </select>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-link" />
            <button className="ql-blockquote" />
        </div>
    }
}