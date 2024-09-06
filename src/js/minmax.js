

// Returns true if one of the players won
function calculateScore(boardState) {

	let value = 0

	let player = 'O'

	if (boardState[0] === player && boardState[0] === boardState[1] && boardState[1] === boardState[2]) {
		value = 1
	}

	if (boardState[3] === player && boardState[3] === boardState[4] && boardState[4] === boardState[5]) {
		value = 1
	}

	if (boardState[6] === player && boardState[6] === boardState[7] && boardState[7] === boardState[8]) {
		value = 1
	}

	if (boardState[0] === player && boardState[0] === boardState[3] && boardState[3] === boardState[6]) {
		value = 1
	}

	if (boardState[1] === player && boardState[1] === boardState[4] && boardState[4] === boardState[7]) {
		value = 1
	}

	if (boardState[2] === player && boardState[2] === boardState[5] && boardState[5] === boardState[8]) {
		value = 1
	}

	if (boardState[0] === player && boardState[0] === boardState[4] && boardState[4] === boardState[8]) {
		value = 1
	}

	if (boardState[2] === player && boardState[2] === boardState[4] && boardState[4] === boardState[6]) {
		value = 1
	}

	player = 'X'

	if (boardState[0] === player && boardState[0] === boardState[1] && boardState[1] === boardState[2]) {
		value = -1
	}

	if (boardState[3] === player && boardState[3] === boardState[4] && boardState[4] === boardState[5]) {
		value = -1
	}

	if (boardState[6] === player && boardState[6] === boardState[7] && boardState[7] === boardState[8]) {
		value = -1
	}

	if (boardState[0] === player && boardState[0] === boardState[3] && boardState[3] === boardState[6]) {
		value = -1
	}

	if (boardState[1] === player && boardState[1] === boardState[4] && boardState[4] === boardState[7]) {
		value = -1
	}

	if (boardState[2] === player && boardState[2] === boardState[5] && boardState[5] === boardState[8]) {
		value = -1
	}

	if (boardState[0] === player && boardState[0] === boardState[4] && boardState[4] === boardState[8]) {
		value = -1
	}

	if (boardState[2] === player && boardState[2] === boardState[4] && boardState[4] === boardState[6]) {
		value = -1
	}

	return value
}

function isWinner(state) {
	if (calculateScore(state) > 0) {
		return true
	}

	if (calculateScore(state) < 0) {
		return true
	}

	return false
}

function isGameOver(state) {
	return state.filter(square => square === null).length <= 0
}

export function Node(value, state, position) {
	this.position = position
	this.value = value
	this.state = state
}

export function minmax(depth, node, maximizingPlayer = true, isRoot = null) {

	const player = maximizingPlayer ? 'O' : 'X'
	
	if (isRoot === null) {
		isRoot = true
	}

	if (depth === 0 || isGameOver(node.state) || isWinner(node.state)) {
		const score = calculateScore(node.state, player) * depth
		return new Node(score, node.state, node.position)
		
	}

	const children = node.state.map((square, index) => {
		if (square === null) {
			let newState = [...node.state]
			newState[index] = player
			return new Node(0, newState, index)
		}

		return null
	}).filter(square => square != null)

	if (maximizingPlayer) {
		let max = -Infinity
		children.forEach(child => {
			let childNode = minmax(depth - 1, child, !maximizingPlayer, false)
			if (childNode.value > max) {
				node.value = childNode.value
				max = childNode.value

				if (isRoot) {
					node.state = childNode.state
					node.position = childNode.position
				}
			}
		})

		return node
	}
	else {

		let min = Infinity

		children.forEach(child => {
			let childNode = minmax(depth - 1, child, !maximizingPlayer, true)
			if (childNode.value < min) {
				node.value = childNode.value
				min = childNode.value
				if (isRoot) {
					node.state = childNode.state
					node.position = childNode.position
				}
			}
		})

		return node
	}
}
