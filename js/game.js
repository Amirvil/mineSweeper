'use strict'

const gLevel = {
    SIZE: 4,
    MINES: 2
}
const gGame = {
    isOn: false,
    isHint: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3,
    safeMoves: 3
}

var gBoard = []
var gStartTime
var gTimeInterval
var gElEmoji = document.querySelector('.emoji')
var gFirstMove

function onInit() {

    gFirstMove = true
    clearInterval(gTimeInterval)

    const elTimer = document.querySelector('.timer')
    elTimer.innerText = '00:00'
    gElEmoji.innerHTML = '<img class="emoji" src="img/emojiPlay.png">'

    gGame.markedCount = 0
    gGame.revealedCount = 0
    gGame.lives = 3
    gGame.hints = 3
    gGame.safeMoves = 3
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    renderHints(gGame.hints)
    updateRemainMines()
    updateLives()
    updateBestScore()
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
                isMarked: false,
                isHint: false
            }
        }
    }
    return board

}


// add mines to the model board after the 1st move
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


// calculate and set inside the model the numbers of neighbors mines of every cell
function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(board, i, j)
        }
    }

}

// checking if the player won
function checkGameOver() {

    if (gGame.markedCount === gLevel.MINES
        && gGame.revealedCount === (gLevel.SIZE ** 2) - gLevel.MINES) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                const currCell = gBoard[i][j]
                if (currCell.isMine && !currCell.isMarked
                    || !currCell.isMine && !currCell.isRevealed) {
                    return false
                }
            }
        }
        return true
    }
    return false

}

function victory() {

    debugger
    gElEmoji.innerHTML = '<img class="emoji" src="img/emojiWin.png">'
    stopTime()
    gGame.isOn = false
    if (gGame.secsPassed < localStorage.getItem(gLevel.SIZE)) localStorage.setItem(gLevel.SIZE, gGame.secsPassed)

}

function updateRemainMines() {

    const elMines = document.querySelector('.mines')
    elMines.innerText = 'Mines: ' + (gLevel.MINES - gGame.markedCount)

}

function updateLives() {

    const elLives = document.querySelector('.lives')
    elLives.innerText = 'Lives: ' + gGame.lives

}

function updateBestScore(){

    var sec = localStorage.getItem(gLevel.SIZE)
    const min = String(Math.floor(sec/ 60))
    sec = String(sec - min * 60)
    const elBestTime = document.querySelector('.best-time')
    elBestTime.innerText = `${min.padStart(2, '0')}:${sec.padStart(2, '0')}`

}

// paint the cell of the mine that the player clicked for 1 sec
function mineRevealed(i, j) {

    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.classList.add('mine-revealed')

    var unRevealedMine = setTimeout(() => {
        elCell.classList.remove('mine-revealed')

    }, 1000);

}

// expand the reveal to other cells
function expandReveal(board, elCell, rowIdx, colIdx) {

    if (board[rowIdx][colIdx].minesAroundCount === 0) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (i === rowIdx && j === colIdx) continue
                if (j < 0 || j >= board[0].length) continue
                if (board[i][j].isRevealed || board[i][j].isMarked) continue
                board[i][j].isRevealed = true
                gGame.revealedCount++
                renderCell({ i: i, j: j }, board[i][j].minesAroundCount)
                expandReveal(board, elCell, i, j)
            }
        }
    }

}

// reveal all the mines when the player lost
function revealAllMines() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isRevealed = true
                renderCell({ i: i, j: j }, '💥')
            }
        }
    }

}

function onCellClicked(elCell, i, j) {

    if (gFirstMove) firstClick(i, j)

    if (!gGame.isOn) return

    const clickedCell = gBoard[i][j]

    if (gGame.isHint) {
        hintCell(gBoard, i, j, true)
        var unRevealedNeig = setTimeout(hintCell, 1500, gBoard, i, j, false)
        gGame.hints--
        renderHints(gGame.hints)
        gGame.isHint = false
        return
    }

    if (clickedCell.isRevealed || clickedCell.isMarked) return

    if (clickedCell.isMine) {

        gGame.lives--
        updateLives()

        if (gGame.lives === 0) {
            gameOver()
            return
        }

        mineRevealed(i, j)
        return
    }

    // update model
    gBoard[i][j].isRevealed = true
    gGame.revealedCount++

    // update DOM
    renderCell({ i: i, j: j }, clickedCell.minesAroundCount)
    expandReveal(gBoard, elCell, i, j)

    if (checkGameOver()) victory()

}

function onCellMarked(elCell, i, j) {

    if (gFirstMove) firstClick(-1, j)

    if (!gGame.isOn) return

    const rClickedCell = gBoard[i][j]

    if (rClickedCell.isRevealed) return

    // update model
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    gGame.markedCount += gBoard[i][j].isMarked ? 1 : -1
    updateRemainMines()

    // update DOM
    renderCell({ i: i, j: j }, '🚩')

    if (checkGameOver()) victory()

}

function firstClick(i, j) {

    gFirstMove = false
    addMines(i, j)
    setMinesNegsCount(gBoard)
    gGame.isOn = true
    startTime()

}

function gameOver() {

    gElEmoji.innerHTML = '<img class="emoji" src="img/emojiLose.png">'
    stopTime()
    revealAllMines()
    gGame.isOn = false

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

function changeMode(elModeBtn) {
    const elBody = document.querySelector('body')
    elBody.classList.toggle('light-mode')

    const elLogo = document.querySelector('.logo')
    elLogo.src = "img/lightLogo.png"

    if (elBody.classList.contains('light-mode')) elModeBtn.innerText = 'Dark Mode'
    else elModeBtn.innerText = 'Light Mode'
}