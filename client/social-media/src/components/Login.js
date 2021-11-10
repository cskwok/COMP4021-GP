import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import  { Link,Redirect,useHistory } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState'

const Login = ()=> {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);    
    const [error, setError] = useState(""); 
    const {msg, setMsg} = useContext(GlobalContext);     
    let history = useHistory();

    if(localStorage.getItem("jwt")){
        history.push('/');  
    }

    const handleLogin = async (e)=>{
        e.preventDefault();       
        setMsg("");
        setError("");
        const conf = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        
        const res = await axios.post("/api/auth/login",
        JSON.stringify({
            email: email,
            password: password
        }),
        conf
        );
        if(res.data.success){            
            localStorage.setItem("jwt",JSON.stringify({
                token:res.data.token,
                username: res.data.username, 
                nickname: res.data.nickname,               
                login:true
            }));
            //setIsLogin(true);
            window.location.href = "/";      
        }else{
            setEmail("");
            setPassword("");
            setError(res.data.msg);
        }
    }

    return (
        <> 
            {error?<div className="alert alert-danger" role="alert">{error}</div>:null}
            {msg?<div className="alert alert-success" role="alert">{msg}</div>:null}           
            <form onSubmit={(e) => handleLogin(e)}>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" value={email} onChange={
                    (e) => setEmail(e.target.value)                    
                    } className="form-control" id="email"  required/> 
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={
                    (e) => setPassword(e.target.value)                    
                    } className="form-control" id="password" required/>
                </div>                
               
                <button type="submit" className="btn btn-primary mr-2">Login</button>        
                <Link to="/register"><button className="btn btn-primary mr-2">Register</button></Link>           
            </form>                  
        </>
    );
}

export default Login;
