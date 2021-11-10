import React, { createContext, useState } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children })=> {
    const [msg, setMsg] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const [info, setInfo] = useState({});
    const [infoLoading, setInfoLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [resultsLoading, setResultsLoading] = useState(true);

    async function getInfo(username){  
        await checkToken();
        const res = await axios.get("/api/users/" + username);  
        if(res.data.success){            
            let info = {       
                pic: res.data.rows[0].pic,
                username: res.data.rows[0].username,                
                nickname: res.data.rows[0].nickname
            } 
            setIsLogin(true);
            setInfo(info);
            setInfoLoading(false);
        }
    }

    async function logOut(){    
        setIsLogin(false);
        localStorage.clear();     
        const res = await axios.get(`/api/auth/logout`);    
    }
    
    async function checkToken(){
        if(!localStorage.getItem("jwt"))return;
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const decoded = jwt.decode(JSON.parse(localStorage.getItem("jwt")).token, {complete: true});
        if(decoded.payload.exp <= (Date.now()/1000 + 60)){
            const conf = {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            };   
            const res = await axios.get(`/api/auth/refreshToken`,conf);        
            
            if(res.data.success){            
                localStorage.setItem("jwt",JSON.stringify({
                    token:res.data.token,
                    username: res.data.username,   
                    nickname: res.data.nickname,               
                    login:true
                }));
            }else{
                logOut();
            }
        }
    }
    async function search(query){
        setResultsLoading(true);
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
            const conf = {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            };   
        const res = await axios.post(`/api/search`,
        JSON.stringify({
            query: query
        }),
        conf
    );   
    if(res.data.success){
        let tempResults=res.data.results;
        if(localStorage.getItem("jwt")){
            for (let index = 0; index < tempResults.length; index++) {
                const res2 = await axios.get(`/api/friends/${tempResults[index].username}/isFriend`,conf);   
                const res3 = await axios.get(`/api/friends/${tempResults[index].username}/isSentRequest`,conf);  
                const res4 = await axios.get(`/api/friends/${tempResults[index].username}/isReceivedRequest`,conf);  
                if(res2.data.success && res3.data.success) {
                    tempResults[index].isFriend = res2.data.isFriend;
                    tempResults[index].isSent = res3.data.isSent;
                    tempResults[index].isReceived = res4.data.isReceived;
                }
            }
        }
        setResults(tempResults);
        setResultsLoading(false);
    }
        
    }

    async function acceptRequest(username){    
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.get(`/api/friends/request/${username}`,conf);
        
        if(res.data.success){
            let tempResults = [...results];
            let index = tempResults.findIndex(result=>result.username===username);
            tempResults[index].isFriend = true;
            setResults(tempResults);
        }
    }

    async function cancelRequest(username){        
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.delete(`/api/friends/request/${username}`,conf);
        
        if(res.data.success){      
            let tempResults = [...results];
            let index = tempResults.findIndex(result=>result.username===username);
            tempResults[index].isReceived = false;
            tempResults[index].isSent = false;
            setResults(tempResults);            
        }
    }

    async function unFriend(username){        
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.delete(`/api/friends/${username}`,conf);
        
        if(res.data.success){      
            let tempResults = [...results];
            let index = tempResults.findIndex(result=>result.username===username);
            tempResults[index].isFriend = false;
            setResults(tempResults);            
        }
    }

    async function sentRequest(username){        
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.get(`/api/friends/request/send/${username}`,conf);
        
        if(res.data.success){
            let tempResults = [...results];
            let index = tempResults.findIndex(result=>result.username===username);
            tempResults[index].isSent = true;
            setResults(tempResults);  
        }
    }

    return (<GlobalContext.Provider value={{      
        isLogin,
        setIsLogin,  
        logOut,
        checkToken,
        msg,
        setMsg,
        getInfo,
        info,
        search,
        results,
        resultsLoading,
        query, 
        setQuery,
        unFriend,
        cancelRequest,
        acceptRequest,
        sentRequest,
        setInfo,
        infoLoading
    }}>
        {children}
    </GlobalContext.Provider>);
}