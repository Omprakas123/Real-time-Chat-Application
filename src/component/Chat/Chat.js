import React, { useEffect, useState } from 'react'
import {user} from "../My/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendlogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";
let socket;  
const ENDPOINT = "https://demo-mchat.herokuapp.com/";
     
const Chat = () => {
  const [id, setid]=useState("");
  const [message, setMessage]=useState([])
  const send=()=>{
   
    const message = document.getElementById('chatInput').value;
    socket.emit('message',{message,id});
    document.getElementById('chatInput').value = "";
  }
                  

   
 useEffect(()=>{
  socket = socketIo(ENDPOINT, {transports: ['websocket']});
  socket.on('connect',()=>{
    alert('connected');
   setid(socket.id); 
   })


   console.log(socket);
   socket.emit('joined',{ user })
   socket.on('welcome',(data)=>
   {
    setMessage([...message,data]);
    console.log(data.user,data.message);
   })
   socket.on('userJoined',(data)=>
   {
    setMessage([...message,data]);
    console.log(data.user,data.message);
   })
   
   socket.on('leave',(data)=>
   {
    setMessage([...message,data]);
    console.log(data.user,data.message);
   })
   
  
     return () =>{
    socket.emit('disconect');
      socket.off();
         }
    },[])

   useEffect(()=>{
  socket.on('sendMessage',(data)=>{
    setMessage([...message,data]);
    console.log(data.user,data.message,data.id);
  })

    return()=>{
    socket.off();
    }
   },[message])

  return (
   
   
   <div className='chatPage'>
  <div className="chatContainer">
  <div className="header">
    <h2>C CHAT</h2>
    <a href='/' ><img src={closeIcon} alt="close" /></a>
  </div>
    <ReactScrollToBottom className="chatBox">
     {message.map((item,i)=>
   <Message user = {item.id===id?'':item.user} message={item.message} classs={item.id===id?'right':'left'} />)}
     
    </ReactScrollToBottom>
    <div className="inputBox">
     <input onKeyPress={(event)=>event.key=== 'Enter' ? send():null} type="text" id="chatInput" />
     <button onClick={send} className="sendBtn"><img src={sendlogo} alt="send" /></button>
    
    
               
         </div>
   </div>

    </div>
  )
}

export default Chat