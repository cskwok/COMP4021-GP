import React, { useState, useContext } from 'react';
import axios from 'axios';
import  { useHistory } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState'

const Register = ()=> { 
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);    
    const [nickname, setNickname] = useState(null);    
    const [gender, setGender] = useState('M');    
    const [birthday, setBirthday] = useState(null);
    const [error, setError] = useState(false);  
    const { setMsg } = useContext(GlobalContext);  
    let history = useHistory();

    if(localStorage.getItem("jwt")&&JSON.parse(localStorage.getItem("jwt")).login){
        history.push('/home'); 
    }

    const handleRegister = async (e)=>{
        e.preventDefault();
        
        const conf = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const res = await axios.post("/api/users/register",
        JSON.stringify({
            username: username,
            email: email,
            password: password,
            nickname: nickname,
            gender: gender,
            birthday: birthday
        }),
        conf
        );
        if(res.data.success){            
            setPassword("");            
            setError(false);
            setMsg("You can now login with your new account");  
            history.push("/login");      
        }else{
            setPassword(""); 
            setError(res.data.msg);
        }
    }

    return (
        <>            
            {error?<div className="alert alert-danger" role="alert">{error}</div>:null}
            <form onSubmit={(e) => {handleRegister(e)}}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" onChange={
                    (e) => setUsername(e.target.value)                    
                    } className="form-control" id="username" aria-describedby="usernameText" required/>                    
                    <small id="usernameText" className="form-text text-muted">Your friends can find you with your username.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" onChange={
                    (e) => setEmail(e.target.value)                    
                    } className="form-control" id="email" aria-describedby="emailText" required/>                    
                    <small id="emailText" className="form-text text-muted">You can use your email to login.</small>
                </div>   
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={
                    (e) => setPassword(e.target.value)                    
                    } className="form-control" id="password" required/> 
                </div>
                <div className="form-group">
                    <label htmlFor="nickName">Nick Name</label>
                    <input type="text" onChange={
                    (e) => setNickname(e.target.value)                    
                    } className="form-control" id="nickName" required/> 
                </div>
                <div class="form-group">
                    <label htmlFor="gender">Gender</label>                    
                    <select class="form-control" id="gender" onChange={(e)=>{setGender(e.target[e.target.selectedIndex].value)}} required>
                        <option value="M">Male</option>
                        <option value="F">Female</option>    
                    </select>
                </div>     
                <div className="form-group">
                    <label htmlFor="birthday">Birthday</label>
                    <input type="date" onChange={
                    (e) => setBirthday(e.target.value)                    
                    } className="form-control" id="birthday" required/> 
                </div>
                <button type="submit" className="btn btn-primary mr-2">Register</button>                   
            </form>

        </>
    );
}

export default Register;
