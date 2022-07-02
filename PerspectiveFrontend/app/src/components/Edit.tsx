import React, { Component } from 'react'
import { request } from '../request'
import Loading from './Util/Loading'
import EditPostHeadline from "./Util/EditPostHeadline";
import { HeadlineData } from './Util/Feed'

interface EditState {
    isLoading: Boolean,
    news: HeadlineData[],
    message?: string
}

export default class Edit extends Component<any, EditState> {
    constructor(props: any){
        super(props);
        
        this.state = {
            isLoading: true, 
            news: [],
            message: undefined
        };
    }
    
    componentDidMount() {
        this.checkForAuthorization();
    }
    
    render(){
        const { isLoading, news, message } = this.state;
        return !isLoading
            ? <Loading withText />
            : <>
                <h1 className="text-center">Редактирование постов</h1>
                {message
                    ? <b>{message}</b>
                    : null}
                {news.map(n=>
                    <EditPostHeadline onDelete={this.handleDelete} data={n} />
                )}
            </>
    }
    
    checkForAuthorization = async () => {
        await request('/api/auth/get-role').then(async response => {
            if(response.status === 401 || response.status === 409) {
                window.location.href = "/";
                return;
            }
            
            const role = (await response.json()).toLowerCase();
            if(role !== "admin" && role !== "editor") {
                window.location.href = "/";
                return;
            }
           
            this.getPosts();
        });
    }
    
    getPosts = async () => {
        await request('/api/edit/all').then(async response => {
            if (response.ok) {
                const news = await response.json();
                this.setState({isLoading: false, news: news});
            } else {
                this.setState({
                    isLoading: false, 
                    message: `Произошла ошибка при попытке загрузить посты. [${response.status}]`
                });
            }
        })
    }
    
    handleDelete = async (id: string) => {
        await request(`/api/edit/delete/${id}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                let { news } = this.state;
                const deletedPost = news.find(n=> n.postId === id) as HeadlineData;
                
                news = news.splice(news.indexOf(deletedPost), 1);
                
                this.setState({
                    news: news, 
                    message: `Пост "${deletedPost.header}" был успешно удалён.`
                });
            } else {
                let msg = `Произошла ошибка при попытке удалить пост. Попробуйте снова. [${response.status}]`;
                if (response.status === 403) msg = `Вы не имеете прав для удаления этого поста.`
                this.setState({message: msg});
            } 
        })
    }
}