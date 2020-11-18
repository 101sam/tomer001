const BOMB = '💣'
const NUM1 = '1️⃣'
const NUM2 = '2️⃣'
const NUM3 = '3️⃣'
const NUM4 = '4️⃣'
const NUM5 = '5️⃣'
const NUM6 = '6️⃣'
const NUM7 = '7️⃣'
const NUM8 = '8️⃣'
const FLAG = '🏁'
const EMPTY = ''

var gClicks = 0
    // var gLives = 3
var gsafeClicks = 3
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard = createBoard()

function init() { //load when page is on 
    if (gGame.isOn) {
        gBoard = createBoard()
        gGame.shownCount = 0
        gGame.markedCount = 0
        gGame.secsPassed = 0
        gClicks = 0
            // randomlyRenderMines(gLevel.MINES)
        renderBoard(gBoard)
        console.table('gBoard :', gBoard)
        setMinesNegsCount(gBoard)
    }
}

function createBoard() { //get Rows and Column length and build a board
    var board = []
    var size = gLevel.SIZE //current value : 4
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cellObj = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cellObj
        }
    }
    board[0][1].isMine = true // just for now :)
    board[1][0].isMine = true //just for now :)
    return board
}

function safeClick() {
    gsafeClicks--
    if (gsafeClicks > 0) {}
}


function restartGame(elBtn) {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gGame.isOn = true
    init()
}

function easyMode(elBtn) {
    gGame.isOn = true
    gLevel.SIZE = 4
    gLevel.MINES = 2
    init()
}

function mediumMode(elBtn) {
    gGame.isOn = true
    gLevel.SIZE = 8
    gLevel.MINES = 12
    init()
}

function hardMode(elBtn) {
    gGame.isOn = true
    gLevel.SIZE = 12
    gLevel.MINES = 30
    init()
}

function renderBoard(board) { //get a board and render it
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            var currCell = ''
                // if (gBoard[i][j].isMine) {
                //     currCell = BOMB
                // }
            var className = 'cells cell-' + i + '-' + j
            strHtml += `<td id="${i}-${j}" class="${className}" onclick="cellClicked(this.id)" oncontextmenu="cellMarked(this.id)">${currCell}</td>`
                // strHtml += `<td class="${className}" onclick="cellClicked(this,event)" onclick = "cellMarked(this,event)">${currCell}</td>`
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml
}

function renderCell(location, value) { //render Cell
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
    gBoard[location.i][location.j].isEmpty = false
}

function checkGameOver() { //check if the game is over 
    var numOfCells = gLevel.SIZE ** 2
    console.log('gGame.shown count = ', gGame.shownCount)
    console.log('num of cells = ', numOfCells)
    console.log('gLevel.MINES = ', gLevel.MINES)
    console.log('gLevel.MarkedCount = ', gLevel.markedCount)
    console.log('gLevel.Mine', gLevel.MINES)
    if (gGame.shownCount >= (numOfCells - gLevel.MINES) && gGame.markedCount === gLevel.MINES) return true
    return false
}

function cellMarked(elId) { //left click :) //maybe needs a bit fix - check at the end 
    if (gGame.isOn) {
        var idName = elId.split("-")
        var i = idName[0]
        var j = idName[1]
        var location = {
            i,
            j
        }
        if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
            gBoard[i][j].isMarked = true
            gGame.markedCount++
                renderCell(location, FLAG)
        }
    }
    console.log('marked count = ', gGame.markedCount)
    console.log('game over ? ', checkGameOver())
}

function cellClicked(elId) { //right click :)
    // if (ev.which === 1) {
    //THE CODE IS WORKING BUT I FOUND A BETTER WAY TO DO IT :)
    // var id = elCell.className
    // var i = id.substring(11, 12)
    // var j = id.substring(13, 14)
    if (gGame.isOn) {
        var idName = elId.split("-")
        var i = idName[0]
        var j = idName[1]

        if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isMine === false) {
            gClicks++
            expandShown(gBoard, i, j)
                // return
        } else if (gBoard[i][j].mineAroundCount != 0 && !gBoard[i][j].isMine && !gBoard[i][j].isShown) {
            gBoard[i][j].isShown = true
            gGame.shownCount++
                gClicks++
                var location = {
                    i,
                    j
                }
            renderCell(location, gBoard[i][j].minesAroundCount)
                // return
        } else if (checkGameOver()) {
            console.log('victory')
            gameLost.isOn = false
        } else if (gBoard[i][j].isMine && gClicks > 0) { //gClicks was added so you wont loss in the first click if you step on a bomb
            var location = {
                i,
                j
            }
            renderMines()
            gGame.isOn = false
                // return
        }
    }
    // console.log('marked count = ', gGame.markedCount)
    console.log('game over ? ', checkGameOver())
}

function renderMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                var location = {
                    i,
                    j
                }
                renderCell(location, BOMB)
            }
        }
    }
}

// cellClicked(elcellsAround[i].id)
function expandShown(board, i, j) {
    var elcellsAround = getNeighborsElCells(board, i, j)
    for (var t = 0; t < elcellsAround.length; t++) {
        var location = GetCellPlaceInBoard(elcellsAround[t])
        gGame.shownCount++
            renderCell(location, gBoard[location.i][location.j].minesAroundCount)
        gBoard[location.i][location.j].isShown = true
    }
}


function GetCellPlaceInBoard(elCell) //return object with i and j places in the board
{
    elId = elCell.id
    var idName = elId.split("-")
    var i = idName[0]
    var j = idName[1]
    var objIndexes = {
        i,
        j
    }
    return objIndexes
}



function setMinesNegsCount(board) { //get a board and set minesAroundCount for each cell - using countMinesAroundCell function 
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var negsAround = countMinesAroundCell(gBoard, i, j)
            board[i][j].minesAroundCount = negsAround
        }
    }
    renderBoard(gBoard)
}

function getHiddenCells(board) //gets a Board and return arrey with the Empty Cells
{
    var cellsCount = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isShown) {
                cellsCount.push(board[i][j])
            }
        }
    }
    return cellsCount
}

function randomlyRenderMines(HowManyMines) { //get how many mines to put, pick cells randomly and set isMine to true 
    while (HowManyMines > 0) {
        var i = getRandomIntInclusive(0, gBoard.length - 1)
        var j = getRandomIntInclusive(0, gBoard[0].length - 1)
        if (!gBoard[i][j].isMine) {
            var location = {
                i,
                j
            }
            gBoard[i][j].isMine = true
            HowManyMines--
        }
    }
}

function getMines() { // return an arrey of all the mines, (each mines cell will contain an object of the cell in the board)!!!!
    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                mines.push(gBoard[i][j])
            }
        }
    }
    return mines
}

function getNeighborsElCells(mat, rowIdx, colIdx) { //get all element of the Cells Around 
    var NeighborsElCells = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[0].length) continue
            if (rowIdx === i && colIdx === j) continue
            if (!mat[i][j].isMine) {
                var elCell = document.getElementById(`${i}-${j}`);
                NeighborsElCells.push(elCell)
            }
        }
    }
    return NeighborsElCells
}

function countMinesAroundCell(mat, rowIdx, colIdx) { // count Mines for each cell - gets a mat with row-I & coll-J and returns how many mines around this cell
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[0].length) continue
            if (rowIdx === i && colIdx === j) continue
            if (mat[i][j].isMine) count++
        }
    }
    return count
}