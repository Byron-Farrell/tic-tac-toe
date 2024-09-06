import { useState } from 'react'
import './Board.css'
import { Button } from '../Button/Button'
import { Node, minmax } from '../../js/minmax'

// The board state when a new game is started
const INITIAL_STATE = [
	null, null, null,
	null, null, null,
	null, null, null
]

// Returns true if one of the players won
function isWinner(boardState) {

	if (boardState[0] != null && boardState[0] === boardState[1] && boardState[1] === boardState[2]) {
		return true
	}

	if (boardState[3] != null && boardState[3] === boardState[4] && boardState[4] === boardState[5]) {
		return true
	}

	if (boardState[6] != null && boardState[6] === boardState[7] && boardState[7] === boardState[8]) {
		return true
	}

	if (boardState[0] != null && boardState[0] === boardState[3] && boardState[3] === boardState[6]) {
		return true
	}

	if (boardState[1] != null && boardState[1] === boardState[4] && boardState[4] === boardState[7]) {
		return true
	}

	if (boardState[2] != null && boardState[2] === boardState[5] && boardState[5] === boardState[8]) {
		return true
	}

	if (boardState[0] != null && boardState[0] === boardState[4] && boardState[4] === boardState[8]) {
		return true
	}

	if (boardState[2] != null && boardState[2] === boardState[4] && boardState[4] === boardState[6]) {
		return true
	}
}


export const Board = (props) => {

	const [boardState, setBoardState] = useState(INITIAL_STATE)
	const [history, setHistory] = useState([INITIAL_STATE])
	const [xIsNext, setXIsNext] = useState(true)
	const [selectedHistory, setSelectedHistory] = useState(0)
	const [isGameOver, setIsGameOver] = useState(false)

	const isPrevDisabled = selectedHistory <= 0
	const isNextDisabled = selectedHistory + 1 >= history.length

	const squareColor = (player) => player === 'X' ? 'red' : 'green'

	const minmaxMove = (boardState) => {
		const node = new Node(null, boardState, null)
		const minmaxNode = minmax(8, node)
		// set state of minmax output
		updateBoard(minmaxNode.state)

		if (isWinner(minmaxNode.state)) {
			setIsGameOver(true)
		}
	}

	const updateHistory = (boardState) => {
		setSelectedHistory(prev => {
			const newSelectedHistory = prev + 1
			setHistory(prev => {
				let newHistory = [...prev]
				if (newSelectedHistory < prev.length) {
					newHistory = newHistory.slice(0, newSelectedHistory)
				}
				return [...newHistory, boardState]
			})

			return newSelectedHistory
		})
	}

	const updateBoard = (boardState) => {
		if (isWinner(boardState)) {
			console.log('WINNER')
		}

		setXIsNext(prev => !prev)

		setBoardState(boardState)
		updateHistory(boardState)
	}

	const isDraw = (board) => {
		const gameOver = board.filter(square => square === null).length === 0
		if (gameOver) {
			setIsGameOver(true)
		}

		return gameOver
	} 

	// Click handler for when a user clicks on one of the squares
	const handleSquareClick = (index) => {

		// If the square has already been used then exit out of the handler
		// TODO: create a toast error message
		if (boardState[index] != null) {
			return
		}

		if (!xIsNext) {
			return
		}
		
		// Copy of the current board state
		const newBoardState = [...boardState]

		newBoardState[index] = 'X'

		

		if (isDraw(newBoardState) || isGameOver) {
			return
		}
		else {
			updateBoard(newBoardState)
			minmaxMove(newBoardState)
		}
		
	}

	const handleHistoryClick = (index) => {
		setSelectedHistory(index)
		setXIsNext(index % 2 === 0)
		setBoardState(history[index])
	}

	const handleRestartClick = () => {
		setBoardState(INITIAL_STATE)
		setHistory([INITIAL_STATE])
		setXIsNext(true)
		setSelectedHistory(0)
		setIsGameOver(false)
	}
	

	return (
		<div className="flex-container">
			<div className="board">
				{boardState.map((player, index) => <div key={index} onClick={() => handleSquareClick(index)} className={"square " + squareColor(player)}>{ player }</div>)}
			</div>
			{
				!isGameOver ? <div className="history">
					<Button disabled={isPrevDisabled} onClick={() => handleHistoryClick(selectedHistory - 1)} className="prev-btn">Previous</Button>
					<Button disabled={isNextDisabled} onClick={() => handleHistoryClick(selectedHistory + 1)} className="next-btn">Next</Button>
				</div> : <div className="history" onClick={handleRestartClick}><Button>Restart</Button></div>
			}
			
		</div>
	);
}