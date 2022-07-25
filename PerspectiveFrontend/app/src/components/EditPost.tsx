import React, { Component } from 'react'
import AuthRoute from './Authentication/AuthRoute'
import Loading from './Util/Loading'
import ReactQuill from 'react-quill'
import EditorToolbar from './Util/EditorToolbar'
import 'react-quill/dist/quill.snow.css';
import request from '../Requests/request'
import { PostInfo } from './Post'

interface EditPostState {
    isLoading: boolean,
    post?: PostInfo,
    isSaved: boolean
    message?: string
}

export default class EditPost extends Component<any, EditPostState> {
    static formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "link",
        "blockquote",
    ];
    
    static modules = { 
        toolbar: {
            container: "#editor-toolbar"
        }
    }
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
                    <form>
                        <input className="form-control" type="file" accept="image/*" id="postImage" />
                        <input className="form-control form-control-lg mb-3" defaultValue={post?.header}
                               onChange={e=>this.handleHeaderUpdate(e)} placeholder="Заголовок"/>
                        <EditorToolbar />
                        <ReactQuill value={post?.rawHtml}
                            modules={EditPost.modules}
                            formats={EditPost.formats}
                            onChange={this.handleChange}/>
                        {!isSaved
                            ? <>
                            <b>Есть несохранённые изменения.</b>
                                <br />
                            </>
                            : null
                        }
                        <button className="btn btn-lg btn-outline-success" 
                                onClick={this.handleSave} disabled={isSaved}>
                            Сохранить
                        </button>
                    </form>
                </>}
        </AuthRoute>
    }
    
    handleChange = (value: string) => {
        const { post } = this.state;
        this.setState({
            post: {
                ...post,
                rawHtml: value
            } as PostInfo,
            isSaved: false
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
    
    handleSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        
        const { post } = this.state;
        if(!post) return;
        
        const { postId, header, rawHtml } = post;
        
        const fileInput = document.getElementById('postImage') as HTMLInputElement;
        const image = fileInput.files && fileInput.files[0];
        
        const formData = new FormData();
        formData.append('PostId', postId);
        formData.append('Header', header);
        formData.append('RawHtml', rawHtml);
        if(image) formData.append('Image', image);
        
        await request('/api/edit/update', {
            method: 'PUT',
            body: formData
        }).then(response => {
            this.setState({isSaved: true});
        }).catch(err=>{
            console.log(err);
            alert('err in console');
            this.setState({
                message: `Произошла непредвиденная ошибка. Попробуйте перезайти на страницу. [${err.response.status}]`
            });
        });
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
           const post = response.data;
           this.setState({isLoading: false, post: post});
        }).catch(err=>{
            const status = err.response.status;
                if (status === 403) {
                    alert('Вы не имеете права редактировать этот пост.');
                    window.location.href = "/";
                    return;
                }

                let msg =`Произошла ошибка при попытке получить пост. Попробуйте снова. [${status}]`;
                this.setState({message: msg});
            });
    }
}