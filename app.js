const express=require('express');
const socket=require('socket.io');
const path=require('path');
const http=require('http');
const {Chess} = require('chess.js');
const { log } = require('console');
const app=express();
const server=http.createServer(app);
const io=socket(server);
const port=process.env.PORT||3000;
const chess=new Chess();
let players={};
let currentPlayer="W";

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
    res.render('index',{title:"Chess Game"});
});

io.on('connection',function(uniquesocket){
    log("Made socket connection");
    if(!players.white){
        players.white=uniquesocket.id;
        uniquesocket.emit('playerColor','W');
    }
    else if(!players.black){
        players.black=uniquesocket.id;
        uniquesocket.emit('playerColor','B');
    }
    else{
        uniquesocket.emit('playerColor','Spectator');
    }
    socket.on("disconnect",(){

    })
});

server.listen(port,function(){
    console.log(`Server is running on port ${port}`);
});