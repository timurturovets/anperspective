import React, { Component } from 'react'
import { Editor, EditorState, ContentState } from 'draft-js'

interface PostHtmlTextareaProps {
    value?: string
    onChange: (newValue: string) => void
}

interface PostHtmlTextareaState {
    editorState: EditorState
}
export default class PostHtmlTextarea extends Component<PostHtmlTextareaProps, PostHtmlTextareaState> {
    constructor(props: PostHtmlTextareaProps){
        super(props);
        
        const { value } = props;
        
        const editorState: EditorState = value
            ? EditorState.createWithContent(ContentState.createFromText(value))
            : EditorState.createEmpty();
        
        this.state = {
            editorState
        };
    }
    
    render() {
        const { editorState } = this.state;
        return <>
                <Editor editorState={editorState} onChange={this.handleChange} />
            </>
    }
    
    handleChange = (e: EditorState) => {
        
        const value = e.getCurrentContent().getAllEntities();
        let a = value.get('');
        this.props.onChange("value");
    }
}