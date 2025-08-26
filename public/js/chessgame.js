const socket=io();
socket.emit('message')
socket.on('Message received',function(){
    console.log("Message received from server");
});