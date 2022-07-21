import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { HeadlineProps } from './Headline'

interface EditPostHeadlineProps extends HeadlineProps {
    onDelete: (id: string) => void
}

export default class EditPostHeadline extends Component<EditPostHeadlineProps, any> { 
    constructor(props: EditPostHeadlineProps){
        super(props);
    }
    
    render() {
        const { header } = this.props.data;
        const { postId } = this.props.data;
        return <div className="d-flex flex-row">
                 <h3>{header}</h3>
                 <div className="btn-toolbar mr-3">
                     <div className="btn-group">
                         <Link to={`/edit/post?id=${postId}`} 
                               className="btn btn-large btn-outline-primary">Редактировать</Link>
                         <button className="btn btn-large btn-outline-danger"
                             onClick={e=>this.handleDeleting(e)}>Удалить</button>
                     </div>
                 </div>
             </div>
    }
    
    handleDeleting = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        
        const { postId, header } = this.props.data;
        if(!window.confirm(`Вы точно хотите удалить пост "${header}"?`)) return;
        
        this.props.onDelete(postId);
    }
}