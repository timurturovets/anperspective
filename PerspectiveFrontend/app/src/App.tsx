import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { configureAuthentication } from './Requests/request'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

import React    from 'react'
import Layout   from './components/Layout'
import Home     from './components/Home'
import Post     from './components/Post'
import Edit     from './components/Edit'
import Create   from './components/Create'
import EditPost from './components/EditPost'
import Login    from './components/Authentication/Login'
import Register from './components/Authentication/Register'

export default class App extends React.Component {
  
  componentDidMount() {
    configureAuthentication();
  }
  
  render(){
    
    return <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/post/" element={<Post />}/>
            <Route path="/about" />
            <Route path="/account" />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit/post" element={<EditPost />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/create" element={<Create />} />
          </Routes>
        </Layout>
    </BrowserRouter>
  }
}