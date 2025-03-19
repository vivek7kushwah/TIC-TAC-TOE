let blocks = document.querySelectorAll(".block");
let Turn = "Crosh";
let gameMode = "multiplayer";
let difficulty = "easy";
let isAITurn = false;

document.getElementById("scorer1").classList.add("chance");

// Initial game mode selection
document.getElementById("initialGameMode").addEventListener("change", (e) => {
    gameMode = e.target.value;
    const ringsInput = document.getElementById("ringsuser");
    if (gameMode === "singleplayer") {
        ringsInput.value = "Computer";
        ringsInput.disabled = true;
    } else {
        ringsInput.value = "";
        ringsInput.disabled = false;
    }
});

// Game state variables
let C = [];
let R = [];
let A = C.concat(R);
let score1 = Number(document.getElementById("scorer1score").innerText);
let score2 = Number(document.getElementById("scorer2score").innerText);

// Handle difficulty changes
document.getElementById("difficulty").addEventListener("change", (e) => {
    if (!isAITurn) {
        difficulty = e.target.value;
        playTapSound();
    }
});

// Submit button handler
let subbtn = document.getElementById("submit");
subbtn.addEventListener("click", () => {
    const selectedMode = document.getElementById("initialGameMode").value;
    const crossPlayer = document.getElementById("croosuser").value.trim();
    const ringPlayer = document.getElementById("ringsuser").value.trim();
    
    if (!selectedMode) {
        alert("Please select a game mode!");
        return;
    }
    
    if (!crossPlayer) {
        alert("Please enter name for Cross side player!");
        return;
    }
    
    if (selectedMode === "multiplayer" && !ringPlayer) {
        alert("Please enter name for Ring side player!");
        return;
    }
    
    gameMode = selectedMode;
    playTapSound();
    stopWinSound();
    document.getElementById("scorer1name").innerText = crossPlayer;
    document.getElementById("scorer2name").innerText = ringPlayer || "Computer";
    document.getElementById("prompt").style.display = "none";
    
    if (gameMode === "singleplayer") {
        document.getElementById("difficultyContainer").style.display = "block";
        if (Turn === "Ring") {
            isAITurn = true;
            makeAIMove();
        }
    }
});

let cancle = document.getElementById("Cancel");
cancle.addEventListener("click", () => {
    playTapSound();
    stopWinSound();
    document.getElementById("scorer1name").innerText = "Vivek";
    document.getElementById("scorer2name").innerText = gameMode === "singleplayer" ? "Computer" : "Gaurav";
    document.getElementById("prompt").style.display = "none";
    
    if (gameMode === "singleplayer") {
        document.getElementById("difficultyContainer").style.display = "block";
        if (Turn === "Ring") {
            isAITurn = true;
            makeAIMove();
        }
    }
});

blocks.forEach((block) => {
    block.addEventListener("click", () => {
        if (A.includes(block.id) || isAITurn) return;
        
        playTapSound();
        if (Turn === "Crosh") {
            Turn = "Ring";
            document.getElementById("scorer2").classList.add("chance");
            document.getElementById("scorer1").classList.remove("chance");
            block.innerHTML = "<div id=icon><img src='bluecross.png'></div>";
            C.push(block.id);
            A = C.concat(R);
            
            if (isgameover(C)) {
                winnerdisplay(document.getElementById("scorer1name").innerText);
                score1++;
                document.getElementById("scorer1score").innerText = score1;
                playWinSound();
                reset();
            } else if (A.length === 9) {
                alert("Match Draws");
                reset();
            } else if (gameMode === "singleplayer") {
                isAITurn = true;
                makeAIMove();
            }
        } else if (!isAITurn) { 
            Turn = "Crosh";
            document.getElementById("scorer1").classList.add("chance");
            document.getElementById("scorer2").classList.remove("chance");
            block.innerHTML = "<div id=icon><img src='ring.png'></div>";
            R.push(block.id);
            A = C.concat(R);
            
            if (isgameover(R)) {
                playWinSound();
                winnerdisplay(document.getElementById("scorer2name").innerText);
                score2++;
                document.getElementById("scorer2score").innerText = score2;
                reset();
            } else if (A.length === 9) {
                alert("Match Draws");
                reset();
            }
        }
        isAITurn = false;
    });
});

// AI Move Functions
function makeAIMove() {
    let selectedBlock;
    
    // Disable all empty blocks during AI's turn
    const emptyBlocks = getEmptyBlocks();
    emptyBlocks.forEach(block => {
        block.style.pointerEvents = "none";
        block.style.cursor = "not-allowed";
    });
    
    // Visual indicator that it's AI's turn
    document.getElementById("scorer2").style.opacity = "0.7";
    
    switch(difficulty) {
        case "easy":
            selectedBlock = makeEasyMove();
            break;
        case "medium":
            selectedBlock = makeMediumMove();
            break;
        case "hard":
            selectedBlock = makeHardMove();
            break;
        default:
            selectedBlock = makeEasyMove();
    }
    
    if (selectedBlock) {
        setTimeout(() => {
            // Re-enable empty blocks and restore visual state
            emptyBlocks.forEach(block => {
                block.style.pointerEvents = "auto";
                block.style.cursor = "pointer";
            });
            document.getElementById("scorer2").style.opacity = "1";
            
            playTapSound();
            selectedBlock.click();
        }, 500); 
    }
}

function makeEasyMove() {
    const emptyBlocks = getEmptyBlocks();
    if (emptyBlocks.length > 0) {
        return emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];
    }
    return null;
}

function makeMediumMove() {
    const emptyBlocks = getEmptyBlocks();
    
    // Try to win
    for (let block of emptyBlocks) {
        R.push(block.id);
        if (isgameover(R)) {
            R.pop();
            return block;
        }
        R.pop();
    }
    
    // Block opponent's win
    for (let block of emptyBlocks) {
        C.push(block.id);
        if (isgameover(C)) {
            C.pop();
            return block;
        }
        C.pop();
    }
    
    // Take center if available
    const center = emptyBlocks.find(block => block.id === "block5");
    if (center) return center;
    
    // Random move
    return makeEasyMove();
}

function makeHardMove() {
    const emptyBlocks = getEmptyBlocks();
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let block of emptyBlocks) {
        R.push(block.id);
        const score = minimax(0, false);
        R.pop();
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = block;
        }
    }
    
    return bestMove;
}

function minimax(depth, isMaximizing) {
    const score = evaluateBoard();
    
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    
    const emptyBlocks = getEmptyBlocks();
    if (emptyBlocks.length === 0) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let block of emptyBlocks) {
            R.push(block.id);
            bestScore = Math.max(bestScore, minimax(depth + 1, false));
            R.pop();
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let block of emptyBlocks) {
            C.push(block.id);
            bestScore = Math.min(bestScore, minimax(depth + 1, true));
            C.pop();
        }
        return bestScore;
    }
}

function evaluateBoard() {
    if (isgameover(R)) return 10;
    if (isgameover(C)) return -10;
    return 0;
}

function getEmptyBlocks() {
    return Array.from(blocks).filter(block => !C.includes(block.id) && !R.includes(block.id));
}

let alert_ = document.getElementById("alert");
function winnerdisplay(playername) {
    alert_.style.display = "flex";
    let winner = document.getElementById("winnername");
    winner.innerText = `Winner is ${playername}..`;
}

document.getElementById("gameover").addEventListener("click", () => {
    playTapSound();
    alert_.style.display = "none";
    stopWinSound();
});

function reset() {
    for (block of blocks) {
        block.innerHTML = "";
        block.style.pointerEvents = "auto";
        block.style.cursor = "pointer";
    }
    document.getElementById("scorer2").style.opacity = "1";
    A = [];
    C = [];
    R = [];
    Turn = "Crosh";
    isAITurn = false;
    document.getElementById("scorer1").classList.add("chance");
    document.getElementById("scorer2").classList.remove("chance");
}

function isgameover(L) {
    let list_elements = [["block1","block2","block3"],["block4","block5","block6"],["block7","block8","block9"],["block1","block4","block7"],["block2","block5","block8"],["block3","block6","block9"],["block1","block5","block9"],["block3","block5","block7"]];
    for (elements of list_elements) {
        if (elements.every(item => L.includes(item))) {
            return true;
        }
    }
    return false;
}

function playTapSound() {
    const tapSound = document.getElementById('tapsound');
    tapSound.currentTime = 0;
    tapSound.play();
}

function playWinSound() {
    const winSound = document.getElementById('winSound');
    const backgroundSound = document.getElementById('backgroundsound');
    backgroundSound.pause();
    winSound.currentTime = 0;
    winSound.play();
}

function stopWinSound() {
    const winSound = document.getElementById('winSound');
    const backgroundSound = document.getElementById('backgroundsound');
    winSound.pause();
    backgroundSound.play();
}
