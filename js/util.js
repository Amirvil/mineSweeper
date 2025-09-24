'use strict'

// render board
function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {


            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
    elContainer.addEventListener("contextmenu", (e) => { e.preventDefault() })
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    if (value !== '🚩') {
        elCell.classList.add('revealed')
        elCell.innerHTML = value
        return
    }

    elCell.innerHTML = (elCell.innerHTML) ? '' : '🚩'
    return

}



// get random num
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// neighbors loop
function countNeighbors(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}

// return empty cells
function getEmptyCells(board) {

    const emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            if (!currCell.isMine && !currCell.isRevealed) emptyCells.push({ i: i, j: j })
        }
    }

    return emptyCells
}

function startTime() {
    gStartTime = new Date()
    clearInterval(gStartTime)
    gTimeInterval = setInterval(updateTime, 1000)

}

function stopTime() {
    clearInterval(gTimeInterval)
}

function updateTime() {
    const elTime = document.querySelector('.timer')
    const diff = Date.now() - gStartTime
    gGame.secsPassed = Math.floor(diff / 1000)
    const minutes = String(Math.floor(gGame.secsPassed / 60))
    const seconds = String(gGame.secsPassed - minutes * 60)

    elTime.innerText = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}
