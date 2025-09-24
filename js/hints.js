'use strict'

function renderHints(count) {
    var strHTML = '<h3>Hints: </h3></br>'
    for (var i = 0; i < count; i++) {
        strHTML += `<img class="hint ${i}" onclick="onClickHint(this)" src="img/bulbOFF.png">`
    }
    const elContainer = document.querySelector('.hints')
    elContainer.innerHTML = strHTML
}

function hintCell(board, rowIdx, colIdx, reveal) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            const elCell = document.querySelector(`.cell-${i}-${j}`)
            if (reveal) {
                const value = (board[i][j].isMine) ? '💥' : board[i][j].minesAroundCount
                elCell.innerHTML = value
            } else {
                if (!board[i][j].isRevealed) elCell.innerHTML = (board[i][j].isMarked) ? '🚩' : ''
            }
        }
    }

}

function onClickHint(hint) {

    if (gGame.isOn) {
        hint.classList.toggle('clicked')
        gGame.isHint = hint.classList.contains('clicked')
    }
}

function safeMove(elSafeBtn) {

    if (gGame.safeMoves === 0) return

    const emptyCells = getEmptyCells(gBoard)
    const safeCell = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]
    const elCell = document.querySelector(`.cell-${safeCell.i}-${safeCell.j}`)
    elCell.classList.add('safe')
    const removeSafe = setTimeout(() => {
        elCell.classList.remove('safe')
    }, 1500);
    gGame.safeMoves--

}