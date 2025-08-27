const socket=io();
const chess=new Chess();
const boardElement=document.querySelector('.chessboard');
let draggedPiece=null;
let playerRole=null;
let sourceSquare=null;

const renderBoard=()=>{
    const board=chess.board();
    boardElement.innerHTML='';
    board.forEach((row,rowindex)=>{
        row.forEach((square,squareindex)=>{
            const squareElement=document.createElement('div');
            squareElement.classList.add("square",
            (rowindex+squareindex)%2===0?'light-square':'dark-square'
            );
            squareElement.dataset.row=rowindex;
            squareElement.dataset.col=squareindex;
            if(square){
                const pieceElement=document.createElement("div");
                pieceElement.classList.add("piece",square.color==='w'?'white-piece':'black-piece');
                pieceElement.innerText=getPieceUnicode(square);
                pieceElement.draggable=playerRole===square.color;
                pieceElement.addEventListener('dragstart',(e)=>{
                    if(pieceElement.draggable){
                        draggedPiece=square;
                        sourceSquare={row:rowindex,col:squareindex};
                        e.dataTransfer.setData('text/plain','');
                    }
                });
                pieceElement.addEventListener('dragend',()=>{
                    draggedPiece=null;
                    sourceSquare=null;
                });
                squareElement.appendChild(pieceElement);
            }
            squareElement.addEventListener('dragover',(e)=>{
                e.preventDefault();
            }); 
            squareElement.addEventListener('drop',(e)=>{
                e.preventDefault();
                if(draggedPiece&&sourceSquare){
                    const targetSource={
                        row:parseInt(squareElement.dataset.row),
                        col:parseInt(squareElement.dataset.col)
                    };
                    const move={
                        from: String.fromCharCode(97+sourceSquare.col)+(8-sourceSquare.row),
                        to: String.fromCharCode(97+targetSquare.col)+(8-targetSquare.row),
                        promotion:'q'
                    };
                    socket.emit('move',move);
                }
            });
        })
    });

};

const handleMove=()=>{};

const getPieceUnicode=()=>{};