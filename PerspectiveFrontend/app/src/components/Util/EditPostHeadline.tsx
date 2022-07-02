import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import Headline from './Feed'
import { HeadlineProps } from './Headline'

interface EditPostHeadlineProps extends HeadlineProps {
    onDelete: (id: string) => void
}

interface EditPostHeadlineState {
    clickedEditing: Boolean
}

export default class EditPostHeadline extends Component<EditPostHeadlineProps, EditPostHeadlineState> { 
    constructor(props: EditPostHeadlineProps){
        super(props);
        
        this.state = {
            clickedEditing: false
        };
    }
    
    render() {
        const { postId } = this.props.data;
        return this.state.clickedEditing
                ? <Navigate to={`/edit/post?id=${postId}`}/>
                : <div className="d-flex flex-row">
                     <Headline data={this.props.data} />
                     <div className="btn-toolbar">
                         <div className="btn-group">
                             <button className="btn btn-large btn-outline-primary"
                                 onClick={e=>this.setState({clickedEditing: true})}>Редактировать</button>
                             <button className="btn btn-large btn-outline-danger"
                                 onClick={e=>this.handleDeleting(e)}>Удалить</button>
                         </div>
                     </div>
                 </div>
    }
    
    handleDeleting = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        
        const { postId, header } = this.props.data;
        if(!confirm(`Вы точно хотите удалить пост "${header}"?`)) return;
        
        this.props.onDelete(postId);
    }
}