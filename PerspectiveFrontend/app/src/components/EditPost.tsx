import React, { Component } from 'react'
import AuthRoute from './Authentication/AuthRoute'
import Loading from './Util/Loading'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import request from '../Requests/request'
import { PostInfo } from './Post'

interface EditPostState {
    isLoading: Boolean,
    post?: PostInfo,
    isSaved: Boolean
    message?: string
}

export default class EditPost extends Component<any, EditPostState> {
    static formats: string[] = [
        
    ];
    constructor(props: any){
        super(props);
        
        this.state = {
            isLoading: true,
            isSaved: true,
            post: undefined,
            message: undefined
        }
    }
    
    componentDidMount() {
        this.getPost();
    }
    
    render() {
        const { isLoading, isSaved, post, message } = this.state;
        return <AuthRoute>
            {isLoading
                ? <Loading withText />
                : <>
                    {message
                        ? <b>{message}</b>
                        : null
                    }
                    {!isSaved
                        ? <b>Есть несохранённые изменения.</b>
                        : null
                    }
                    <form>
                    <span className="text-center">
                        <p>Заголовок</p>
                        <input className="form-control form-control-lg mb-3" defaultValue={post?.header}
                               onChange={e=>this.handleHeaderUpdate(e)} />
                    </span>
                        <ReactQuill value={post?.rawHtml}
                            onChange={this.handleChange}/>
                        <button className="btn btn-lg btn-outline-success" onClick={this.handleSave}>
                            Сохранить
                        </button>
                    </form>
                </>}
        </AuthRoute>
    }
    
    handleChange = (value: string) => {
        console.log(value);
        this.setState({
            post: {
                ...this.state.post,
                rawHtml: value
            } as PostInfo
        });
    }
    handleHeaderUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        
        this.setState({
            post: {
            ...this.state.post,
                header: e.target.value
            } as PostInfo})
    }
    
    handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        //Todo
    }
    
    getPost = async () => {
        const query = new URLSearchParams(window.location.search);

        const id = query.get('id');
        if(!id) {
            alert('Отсутствует ID поста в строке запроса. Попробуйте перезайти на страницу.');
            window.location.href = "/";
        }
        
        await request(`/api/edit/post?id=${id}`)
        .then(response => {
           if (response.status === 200) {
               const post = response.data;
               this.setState({isLoading: false, post: post});
           } else {
               if (response.status === 403) {
                   alert('Вы не имеете права редактировать этот пост.');
                   window.location.href = "/";
                   return;
               }
               
               let msg =`Произошла ошибка при попытке получить пост. Попробуйте снова. [${response.status}]`;
               this.setState({message: msg});
           }
        });
    }
}