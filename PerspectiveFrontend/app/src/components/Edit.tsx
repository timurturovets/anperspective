import React, { Component } from 'react'
import request from '../Requests/request'
import AuthRoute from './Authentication/AuthRoute'
import Loading from './Util/Loading'
import EditPostHeadline from "./Util/EditPostHeadline";
import { HeadlineData } from './Util/Feed'
import { Link } from 'react-router-dom'

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
        this.getPosts();
    }
    
    render(){
        const { isLoading, news, message } = this.state;
        return <AuthRoute roles={["editor", "admin"]}>
                <h1 className="text-center">Редактирование постов</h1>
                <Link to="/create" className="btn btn-success">Создать новый пост</Link><br />
                {isLoading
                    ? <Loading withText />
                    : <>
                        {message
                            ? <b>{message}</b>
                            : null
                        }
                        {news.map(
                        n => <EditPostHeadline key={n.postId} onDelete={this.handleDelete} data={n} />
                        )}
                    </>
                }
            </AuthRoute>
    }
    
    getPosts = async () => {
        await request('/api/edit/all').then(response => {
                const news = response.data;
                console.log(news);
                this.setState({isLoading: false, news: news});
        }).catch(err=>{
            console.log(err);
            this.setState({
                isLoading: false,
                message: `Произошла ошибка при попытке загрузить посты. [${err.message}]`
            });
        });
    }
    
    handleDelete = async (id: string) => {
        await request(`/api/edit/delete/${id}`, {
            method: 'DELETE'
        }).then(response => {
            let { news } = this.state;
            const deletedPost = news.find(n=> n.postId === id) as HeadlineData;
            
            news = news.splice(news.indexOf(deletedPost), 1);
            
            this.setState({
                news: news, 
                message: `Пост "${deletedPost.header}" был успешно удалён.`
            });
        }).catch(err => {
            let msg = `Произошла ошибка при попытке удалить пост. Попробуйте снова. [${err.message}]`;
            if (err.status === 403) msg = `Вы не имеете прав для удаления этого поста.`
            this.setState({message: msg});
        });
    }
}