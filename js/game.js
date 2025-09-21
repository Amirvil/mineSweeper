'use strict'

const gLevel = {
    SIZE: 4,
    MINES: 2
}
const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard = []
var gStartTime
var gTimeInterval
var gFlagCounter
var gElEmoji = document.querySelector('.emoji')
var gFirstMove

function onInit() {
    gFirstMove = true
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = '00:00'
    gElEmoji.innerText = '👽'
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    gFlagCounter = 0
    updateRemainMines()
    clearInterval(gTimeInterval)
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])

        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function addMines(i, j) {
    var count = 0
    while (count < gLevel.MINES) {
        const idxI = getRandomIntInclusive(0, gBoard.length - 1)
        const idxj = getRandomIntInclusive(0, gBoard.length - 1)
        if (i !== -1) {
            if (idxI === i && idxj === j) continue
        }
        if (gBoard[idxI][idxj].isMine) continue
        gBoard[idxI][idxj].isMine = true
        count++
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(board, i, j)
        }
    }
}

function onCellClicked(elCell, i, j) {
    if (gFirstMove) firstClick(i, j)
    if (gGame.isOn) {
        if (gBoard[i][j].isMarked || gBoard[i][j].isRevealed) return
        gBoard[i][j].isRevealed = true
        renderCell({ i: i, j: j })
        if (gBoard[i][j].isMine) {
            gElEmoji.innerText = '💀'
            stopTime()
            revealAllMines()
            gGame.isOn = false
            return
        }
        expandReveal(elCell, i, j)
        if (gFlagCounter === gLevel.MINES) checkGameOver()
    }
}

function onCellMarked(elCell, i, j) {
    if (gFirstMove) firstClick(-1, j)
    if (gGame.isOn) {
        if (gBoard[i][j].isRevealed) return
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
        gFlagCounter += gBoard[i][j].isMarked ? 1 : -1
        renderCell({ i: i, j: j })
        updateRemainMines()
        if (gFlagCounter === gLevel.MINES) checkGameOver()
    }
}

function firstClick(i, j) {
    gFirstMove = false
    addMines(i, j)
    setMinesNegsCount(gBoard)
    gGame.isOn = true
    startTime()
}


function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine && !currCell.isMarked
                || !currCell.isMine && !currCell.isRevealed) {
                return false
            }
        }
    }
    gElEmoji.innerText = '👻'
    stopTime()
    gGame.isOn = false
    return true
}

function updateRemainMines() {
    const elMines = document.querySelector('.mines')
    elMines.innerText = gLevel.MINES - gFlagCounter
}


function expandReveal(elCell, rowIdx, colIdx) {
    if (gBoard[rowIdx][colIdx].minesAroundCount === 0) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (i === rowIdx && j === colIdx) continue
                if (j < 0 || j >= gBoard[0].length) continue
                if (gBoard[i][j].isRevealed || gBoard[i][j].isMarked) continue
                gBoard[i][j].isRevealed = true
                renderCell({ i: i, j: j })
                expandReveal(elCell, i, j)
            }
        }
    }
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isRevealed = true
                renderCell({ i: i, j: j })
            }
        }
    }
}


function onClickLevel(elBtn) {
    switch (elBtn.innerText) {
        case 'Begginer':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break;
        case 'Medium':
            gLevel.SIZE = 8
            gLevel.MINES = 14
            break;
        case 'Expert':
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break;
    }
    onInit()
}
