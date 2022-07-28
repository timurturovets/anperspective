import React, { Component } from 'react'
import AuthRoute from './Authentication/AuthRoute'
import Loading from './Util/Loading'
import ReactQuill from 'react-quill'
import EditorToolbar from './Util/EditorToolbar'
import 'react-quill/dist/quill.snow.css';
import request from '../Requests/request'
import PostInfo from './Interfaces/PostInfo'

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
        const imgUrl = post?.imageLocation && `${process.env.REACT_APP_API_URL}/${post.imageLocation}`;
        return <AuthRoute>
            {isLoading
                ? <Loading withText />
                : <>
                    {message
                        ? <b>{message}</b>
                        : null
                    }
                    <form>
                        <div className="d-flex flex-row">
                            {
                                (imgUrl && <>
                                    <img src={imgUrl} alt="Картинка заголовка" className="headline-img"/>
                                    <br />
                                    <button className="btn btn-sm btn-outline-danger"
                                            onClick={this.handleImageDelete}>Удалить картинку</button>
                                </>) 
                                || <input onChange={e=>this.setState({isSaved: false})}
                                      className="form-control" type="file" accept="image/*" id="postImage"/>
                            }
                        <input className="form-control form-control-lg mb-3" defaultValue={post?.header}
                               onChange={this.handleHeaderUpdate} placeholder="Заголовок"/>
                        </div>
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
                        <button className={isSaved?"btn btn-lg btn-outline-success":"btn btn-lg btn-success"} 
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
        
        const { post } = this.state;
        if(!post) return;
        
        this.setState({
            post: {
                ...post,
                header: e.target.value
            }})
    }
    
    handleImageDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        
        const { post } = this.state;
        if(!post) return;
        
        this.setState({
            post: {
                ...post,
                imageLocation: ""
            },
            isSaved: false
        })
    }
    
    handleSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        
        const { post } = this.state;
        if(!post) return;
        
        const { postId, header, rawHtml, imageLocation } = post;

        const formData = new FormData();
        formData.append('PostId', postId);
        formData.append('Header', header);
        formData.append('RawHtml', rawHtml);

        if(!imageLocation) {
            const fileInput = document.getElementById('postImage') as HTMLInputElement;
            const image = fileInput.files && fileInput.files[0];
            if(image) formData.append('Image', image);
        }
        
        await request('/api/edit/update', {
            method: 'PUT',
            body: formData
        }).then(() => {
            this.setState({isSaved: true});
        }).catch(err=>{
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