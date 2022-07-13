import React, { Component } from 'react'

interface PostHtmlTextareaProps {
    value?: string
    onChange: (newValue: string) => void
}

interface PostHtmlTextareaState {
    isCheckingView: Boolean
}
export default class PostHtmlTextarea extends Component<PostHtmlTextareaProps, PostHtmlTextareaState> {
    constructor(props: PostHtmlTextareaProps){
        super(props);
        
        this.state = {
            isCheckingView: false
        };
    }
    
    render() {
        const { isCheckingView } = this.state;
        return <>
                <button className="btn btn-outline-primary"
                    onClick={e=>this.setState({isCheckingView: !isCheckingView})}>
                    {isCheckingView
                        ? "Вернуться к редактированию"
                        : "Просмотреть, как выглядит пост"
                    }
                </button>
                <textarea onChange={e=>this.handleChange(e)} rows={5}>
                    {this.props.value}
                </textarea>
            </>
    }
    
    handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        
        const value = e.target.value;
        this.props.onChange(value);
    }
}