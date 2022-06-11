import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'

export default class App extends React.Component {
  render(){
    
    return <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/feed" />
            <Route path="/about" />
            <Route path="/account" />
          </Routes>
        </Layout>
    </BrowserRouter>
  }
}