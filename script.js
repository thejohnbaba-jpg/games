let boxes= document.querySelectorAll(".box");
let msg=document.getElementById("msg");
let msgcontainer= document.querySelector(".msg-container");
let newgame=document.getElementById("new-btn");
let resetgame= document.getElementById("reset-btn");
let count=0;
let container= document.querySelector(".container");
let introForm=document.querySelector(".introForm");



const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];

console.dir(boxes);

let turn=true;

for(let box of boxes){
   box.addEventListener("click",()=>{
    count++;
    if(turn){

        box.innerText="O";
        turn=false;

    }else{
        box.innerText="X";

        turn=true;

    }
    box.disabled=true;
    let isWinner=checkWinner();
    if(isWinner){
        disableBox();
    }
    if(count==9 && !isWinner){
        showWinner("Game is Draw :)");
    }


   })
};

const checkWinner=()=>{

    for(let pattern of winPatterns){
        let pos1=boxes[pattern[0]].innerText;
        let pos2=boxes[pattern[1]].innerText;
        let pos3=boxes[pattern[2]].innerText;

        if(pos1 !=="" && pos2 !=="" && pos3 !==""){
            if(pos1===pos2 && pos2===pos3){
                showWinner(`Winner is  ${pos1}`);
                return true;
            }
            
        }
        

    }

    return false;
};

const showWinner=(winner)=>{
    msg.innerText=winner;
    msgcontainer.classList.remove("hide");
};

const disableBox = () => {
    for (let box of boxes) {
        box.disabled = true; // Disable form elements
    }
};

const enableboxes=()=>{
    for(let box of boxes){
        box.disabled=false;
        box.innerText="";
    }
}


const reset=()=>{
    turn =true;
    count=0;
    enableboxes();
    msgcontainer.classList.add("hide");
};

 resetgame.addEventListener("click",reset);
 newgame.addEventListener("click",reset);

