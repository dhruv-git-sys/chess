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
        uniquesocket.emit('playerRole','w');
    }
    else if(!players.black){
        players.black=uniquesocket.id;
        uniquesocket.emit('playerRole','b');
    }
    else{
        uniquesocket.emit('playerRole','Spectator');
    }
    uniquesocket.on("disconnect",function(){
        if(uniquesocket.id===players.white){
            delete players.white;
        }
        else if(uniquesocket.id===players.black){
            delete players.black;
        }
        else{
            log("A spectator disconnected");
        }
    });
    uniquesocket.on('move',(move)=>{
        try{
            if(chess.turn()==='w'&&uniquesocket.id!==players.white){
                return;
            }
            if(chess.turn()==='b'&&uniquesocket.id!==players.black){
                return;
            }
            const result=chess.move(move);
            if(result){
                currentPlayer=chess.turn();
                io.emit("move",move);
                io.emit("boardState",chess.fen());
            }
            else{
                log("Invalid move: ",move);
                uniquesocket.emit("invalidMove",move);

            }
        }
        catch(err){
            log(err);
            uniquesocket.emit("Invalid move: ",move);
            
        }
    })
});

server.listen(port,function(){
    console.log(`Server is running on port ${port}`);
});