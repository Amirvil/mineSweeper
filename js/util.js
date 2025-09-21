'use strict'

// create matrix
function createMat(rows, cols) {
    const mat = []
    for (var i = 0; i < rows; i++) {
        const row = []
        for (var j = 0; j < cols; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

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
function renderCell(location) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = ''
    if (gBoard[location.i][location.j].isMarked) {
        elCell.innerHTML = '🚩'
        return
    }
    if (gBoard[location.i][location.j].isRevealed) {
        elCell.innerHTML = (gBoard[location.i][location.j].isMine) ? '💥' : gBoard[location.i][location.j].minesAroundCount
        elCell.classList.add('revealed')
    }
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
            if (board[i][j].type === FLOOR && board[i][j].gameElement === null) emptyCells.push({ i: i, j: j })
        }
    }

    return emptyCells
}

// sum col
function sumCol(mat, colIdx) {
    var sum = 0
    for (var i = 0; i < mat.length; i++) {
        sum += mat[i][colIdx]
    }
    return sum
}

// sum row
function sumRow(mat, rowIdx) {
    var sum = 0
    for (var i = 0; i < mat[rowIdx].length; i++) {
        sum += mat[rowIdx][i]
    }
    return sum
}

function findMax(mat, colIdx) {
    var max = -Infinity
    for (var i = 0; i < mat.length; i++) {
        if (mat[i][colIdx] > max) max = mat[i][colIdx]
    }
    return max
}


function findAvg(mat) {
    var sum = 0
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[i].length; j++) {
            sum += mat[i][j]
        }
    }
    return sum / (mat.length ** 2)
}

function sumArea(mat, rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd) {
    var sum = 0
    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        for (var j = colIdxStart; j <= colIdxEnd; j++) {
            sum += mat[i][j]
        }
    }
    return sum
}

function bubbleSort(nums) {
    var arrLength = nums.length
    var swapped
    for (var i = 0; i < arrLength - 1; i++) {
        swapped = false
        for (var j = 0; j < arrLength - 1; j++) {
            if (nums[j] > nums[j + 1]) {
                [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]]
                swapped = true
            }
        }
        if (!swapped) break
    }
    return nums
}

function sumArrays(arr1, arr2) {
    var long = (arr1.length > arr2.length) ? arr1 : arr2
    var short = (long === arr1) ? arr2 : arr1
    var res = []
    for (var i = 0; i < long.length; i++) {
        var sum = short[i] + long[i]
        if (isNaN(sum)) sum = long[i]

        res.push(sum)
    }
    return res
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'

    for (var i = 0; i < 6; i++) {
        color += letters[getRandomInt(0, letters.length)]
    }
    return color
}

function startTime() {
    gStartTime = new Date()
    clearInterval(gStartTime)
    gTimeInterval = setInterval(updateTime, 37)

}

function stopTime() {
    clearInterval(gTimeInterval)
}

function updateTime() {
    const elTime = document.querySelector('.timer')
    const diff = Date.now() - gStartTime
    const totalSeconds = Math.floor(diff/1000)
    const minutes = String(Math.floor(totalSeconds/60))
    const seconds = String(totalSeconds - minutes * 60)

    elTime.innerText = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}
