let blocks = document.querySelectorAll(".block");
let Turn= "Crosh";
document.getElementById("scorer1").classList.add("chance");
function isgameover(L){
    let list_elements = [["block1","block2","block3"],["block4","block5","block6"],["block7","block8","block9"],["block1","block4","block7"],["block2","block5","block8"],["block3","block6","block9"],["block1","block5","block9"],["block3","block5","block7"]];
    for (elements of list_elements) {
        if (elements.every(item => L.includes(item))){
            return true
        }
    }
    return false
}


let C =[];
let R =[];
let A = C.concat(R);
let score1 = Number(document.getElementById("scorer1score").innerText);
let score2 = Number(document.getElementById("scorer2score").innerText);
let subbtn = document.getElementById("submit");
subbtn.addEventListener("click",()=>{
    playTapSound()
    stopWinSound()
    document.getElementById("scorer1name").innerText=document.getElementById("croosuser").value;
    document.getElementById("scorer2name").innerText=document.getElementById("ringsuser").value;
    document.getElementById("prompt").style.display= "none";
})
let cancle = document.getElementById("Cancel");
cancle.addEventListener("click",()=>{
    playTapSound()
    stopWinSound()
    document.getElementById("scorer1name").innerText= "Vivek";
    document.getElementById("scorer2name").innerText= "Gaurav";
    document.getElementById("prompt").style.display= "none";

})
let alert_ = document.getElementById("alert");
function winnerdisplay(playername){
    alert_.style.display="flex";
    let winner = document.getElementById("winnername");
    winner.innerText=`Winner is ${playername}..`;
}

document.getElementById("gameover").addEventListener("click",()=>{
    playTapSound()
    alert_.style.display="none";
    stopWinSound()
})
    





blocks.forEach((block)=>{
    block.addEventListener("click",()=>{
        playTapSound()
        if (A.includes(block.id)){
        }else{
            
            if (Turn==="Crosh"){
                Turn = "Ring"
                document.getElementById("scorer2").classList.add("chance");
                document.getElementById("scorer1").classList.remove("chance")
                block.innerHTML="<div id=icon > <img src='bluecross.png'> </div>";
                C.push(block.id);
                A=C.concat(R);
                if (isgameover(C)){
                    winnerdisplay(document.getElementById("scorer1name").innerText)
                    score1++
                    document.getElementById("scorer1score").innerText = score1;
                    playWinSound()
                    reset()
                }
                else if (A.length===9) {
                    alert("match Draws")
                    reset()
                    
                } 
            }else{
                Turn = "Crosh"
                document.getElementById("scorer1").classList.add("chance");
                document.getElementById("scorer2").classList.remove("chance");
                block.innerHTML="<div id=icon > <img src='ring.png'> </div>";
                R.push(block.id);
                A=C.concat(R);
                if (isgameover(R)){
                    playWinSound()
                    winnerdisplay(document.getElementById("scorer2name").innerText);
                    score2++
                    document.getElementById("scorer2score").innerText = score2;
                    reset()
                }else if (A.length===9) {
                    alert("match Draws")
                    reset()
                    
                } 
            }  
            
            
            
        }
        


    })
    

})



function reset(){
    for (block of blocks){
        block.innerHTML=""
    }
    A=[]
    C=[]
    R=[]
}
function playTapSound() {
    const tapSound = document.getElementById('tapsound');
    tapSound.currentTime = 0; 
    tapSound.play();
}


function playWinSound() {
    const winSound = document.getElementById('winSound');
    const backgroundSound = document.getElementById('backgroundsound');
    backgroundSound.pause()
    winSound.currentTime = 0;
    winSound.play();

}
function stopWinSound() {
    const winSound = document.getElementById('winSound');
    const backgroundSound = document.getElementById('backgroundsound');
    winSound.pause();
    backgroundSound.play()

}
