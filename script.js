const X_CLASS = 'x'
const O_CLASS = 'o'
const AI_TURN = 'AI_TURN'
const USER_TURN = 'USER_TURN'


const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

let boardMatrix = [ 
    ['','',''],
    ['','',''],
    ['','','']
]

const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('boardId')
const endMessageElement = document.getElementById('endMesage')
const retryButton = document.getElementById('retryBtn')
const switchButton = document.getElementById('switch')
const endMessageTextElement = document.querySelector('[data-end-message]')
let userClass  = X_CLASS;
let aiClass  = O_CLASS;
let userTurn
let convert //for managing scores when either user or AI played first;
            // convert = 1 when user first and -1 when AI first

/* Scores for minimax algorithm */
const scores = {
    'o': 1,
    'x': -1,
    'tie': 0
  };

/* Initialize board matrix using value in grid */
function initBoardMatrix(){
    let k = 0;
    for(let i=0;i<3;++i){
        for(let j=0;j<3;++j){
            if(cellElements[k].classList.contains(X_CLASS))
                boardMatrix[i][j]= X_CLASS;
            else if(cellElements[k].classList.contains(O_CLASS))
                boardMatrix[i][j] = O_CLASS;
            else
                boardMatrix[i][j]='';
            ++k;
        }            
    }
}

/* Setting start values of variables */
function setStartPreference(){
    
    if(userClass == X_CLASS){
        userTurn = true;
        convert = 1;
    }
    else{
        userTurn = false;
        convert = -1;
    }
    initBoardMatrix();
}

startGame()
retryButton.addEventListener('click', startGame)

function startGame() {
    setStartPreference();

    cellElements.forEach(cell => {     
      cell.classList.remove(X_CLASS)  //clearing previous X and O (if any)
      cell.classList.remove(O_CLASS)
      cell.removeEventListener('click', handleClick)  //removing EventListener
      cell.addEventListener('click', handleClick, { once: true })  //adding EventListener
    })

    setBoardHoverClass(); //setting hover effects
    endMessageElement.classList.remove('show');
    if(!userTurn)
        aiTurn();
  }

//AI turn
function aiTurn(){
    initBoardMatrix();

    let bestScore = -Infinity
    let bestMove = 0
    let k = 0;
    for(let i=0;i<3;++i){
        for(let j =0; j<3;++j){

            if(boardMatrix[i][j]==''){
                boardMatrix[i][j]=aiClass;

                let score = minimax(false);
                boardMatrix[i][j] = '';
                if(score > bestScore){
                    console.log(score);
                    bestScore = score;    
                    bestMove = k;
                    console.log(k);

                }
            }
            ++k;
        }
    }
    placeMark(cellElements[bestMove],aiClass);
    if(! isEnd(aiClass)){
        swapTurns();
    }
}

function minimax(isMaximizing){

    let result = checkWinner();
    if (result !== null) {
        return scores[result]*convert;
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (boardMatrix[i][j] == '') {
              boardMatrix[i][j] = aiClass;
              let score = minimax(false);
              boardMatrix[i][j] = '';
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (boardMatrix[i][j] == '') {
              boardMatrix[i][j] = userClass;
              let score = minimax(true);
              boardMatrix[i][j] = '';
              bestScore = Math.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
}


function equals3(a, b, c) {
    return a == b && b == c && a != '';
  }




function nextEmpty(){
    for(let i = 0;i<9;i++){
        
        if(!cellElements[i].classList.contains(X_CLASS) &&
        !cellElements[i].classList.contains(O_CLASS)){
            return i;
        }
    }
}

//to check for cell already filled
function checkForAlreadyFillerCell(cell){
    if(cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS))
        return true;
    else 
        return false;
}

function handleClick(e) {
  const cell = e.target
  if(checkForAlreadyFillerCell(cell)){
      return;
  }
  const currentClass = userClass
  placeMark(cell, currentClass)

  if(! isEnd(currentClass)){
    swapTurns();
      aiTurn();
  }
}

function isEnd(currentClass){
    if (checkWin(currentClass)) {
        endGame(false)
      } else if (isDraw()) {
        endGame(true)
      } else {
          return false;
      }
      return true;
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
  })
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}

function swapTurns() {
  userTurn = !userTurn
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(O_CLASS)
  if (userTurn) {
    board.classList.add(X_CLASS)
  } else {
    board.classList.add(O_CLASS)
  }
}

/* to check for win */
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}

function checkWinner() {
    let winner = null;
  
    // horizontal
    for (let i = 0; i < 3; i++) {
      if (equals3(boardMatrix[i][0], boardMatrix[i][1], boardMatrix[i][2])) {
        winner = boardMatrix[i][0];
      }
    }
  
    // vertical
    for (let i = 0; i < 3; i++) {
      if (equals3(boardMatrix[0][i], boardMatrix[1][i], boardMatrix[2][i])) {
        winner = boardMatrix[0][i];
      }
    }
  
    // Diagonal
    if (equals3(boardMatrix[0][0], boardMatrix[1][1], boardMatrix[2][2])) {
      winner = boardMatrix[0][0];
    }
    if (equals3(boardMatrix[2][0], boardMatrix[1][1], boardMatrix[0][2])) {
      winner = boardMatrix[2][0];
    }
  
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardMatrix[i][j] == '') {
          openSpots++;
        }
      }
    }
  
    if (winner == null && openSpots == 0) {
      return 'tie';
    } else {
      return winner;
    }
  }

/* Display game end result with retry button */
function endGame(draw) {
    if (draw) {
      endMessageTextElement.innerText = 'Draw!'
    } else {
      endMessageTextElement.innerText = `${userTurn ? "You" : "AI"} Won!`
    }
    endMessageElement.classList.add('show')
  }