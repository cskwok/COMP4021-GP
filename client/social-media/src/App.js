import React, { useContext, useEffect,useState } from 'react';
import Profile from './components/Profile';
import Feed from './components/Feed';
import AuthRoute from './components/AuthRoute';
import Login from './components/Login';
import Register from './components/Register';
import { GlobalContext } from './context/GlobalState'
import { PostsProvider } from './context/PostsState'
import { ProfileProvider } from './context/ProfileState'
import { BrowserRouter, Switch, Route,Link,Redirect,useParams } from 'react-router-dom';
import Search from './components/Search';
import Page404 from './components/Page404';
import { Helmet } from 'react-helmet'

function App() {
  const {isLogin,setIsLogin,getInfo,info,logOut, setQuery,query,infoLoading} = useContext(GlobalContext); 
  

  useEffect(()=>{
    if(localStorage.getItem("jwt")){
      setIsLogin(true);
    }else{
      setIsLogin(false);
    }
  },[]) 
  useEffect(()=>{
    if(isLogin||localStorage.getItem("jwt"))
      getInfo(JSON.parse(localStorage.getItem("jwt")).username);
  },[isLogin])

  const handleLogOut=()=>{
    logOut();
    //window.location.href = "/login";
  }
  return (
    <>
     <Helmet>
      <title>HOW's</title>
    </Helmet>
    <BrowserRouter>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      
        <nav  className="navbar navbar-expand-lg fixed-top navbar-light bg-white shadow-sm">
        <Link to={`/`}><img className="logo navbar-brand" src={`${process.env.PUBLIC_URL}/logo.jpg`}/></Link>
          <button  className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span  className="navbar-toggler-icon"></span>
          </button>
          
          <div  className="collapse navbar-collapse" id="navbarSupportedContent">
          {infoLoading?null:
            !isLogin?null:
            <form  className="form-inline ml-auto my-1 my-lg-0" >
              <input  className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={(e)=>{setQuery(e.target.value)}}/>
              <Link to={`/search/${query}`}><button  className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button></Link>
            </form>
          }
           {
              !isLogin?
            <ul className="navbar-nav ml-auto mr-4 mt-1">
             
              <li className="nav-item">
              <a href="/login" className="nav-link">Login</a>
              </li>
              
            </ul>:
            <ul className="navbar-nav ml-auto mr-4 mt-1">
             
             <li className="nav-item dropdown">
                <h5 className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
           {infoLoading?null:<img src={`/img/${info.pic}`} className="mr-3 img-thumbnail profile-pic-xs"  />}{info.nickname}
                </h5>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href={`/profile/${info.username}`} >Profile</a>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item btn btn-light"  onClick={()=>{handleLogOut()}}>LogOut</div>
                </div>
              </li>
            
          </ul>
             }
          </div>
          
        </nav>
            
        <div  className="container-fluid bg-white" style={{marginTop:"6.5rem",width:"95%"}}>
      <Switch>
          <Route path="/login"  component={Login} />
          <Route path="/register"  component={Register} />
          <AuthRoute path="/search/:query"  component={Search} />
          <PostsProvider>
          <AuthRoute path="/" exact component={Feed} />
          <ProfileProvider>
              <Route path="/profile/:username" component={Profile} />
          </ProfileProvider>
          </PostsProvider>
          
      </Switch>
      </div>
      
    </BrowserRouter>
    </>
  );

}

export default App;
