import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Edit from './components/Edit'
import Login from './components/Authentication/Login'
import Register from './components/Authentication/Register'
import AuthRoute from "./components/Authentication/AuthRoute";

export default class App extends React.Component {
  render(){
    
    return <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/post/" />
            <Route path="/about" />
            <Route path="/account" />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit" element={<AuthRoute element={<Edit />} />} />
          </Routes>
        </Layout>
    </BrowserRouter>
  }
}