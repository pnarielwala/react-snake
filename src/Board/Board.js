// @flow
import React, { Component, type Element } from 'react'
import Tile from './components/Tile'
import styles from './Board.module.scss'

const NUM_OF_ROWS = 20
const SNAKE_INIT = [[NUM_OF_ROWS / 2, NUM_OF_ROWS / 2]]

type PropsT = {}

type StateT = {
  food: ?[number, number],
  snake: Array<[number, number]>,
  direction: 'left' | 'right' | 'up' | 'down',
  gameStatus: 'none' | 'playing' | 'end',
}

class Board extends Component<PropsT, StateT> {
  state = {
    food: null,
    snake: [],
    direction: 'right',
    gameStatus: 'none',
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onDirectionSelect)
  }

  onDirectionSelect = (event: SyntheticKeyboardEvent<*>) => {
    switch (event.keyCode) {
      case 37: // left
        return this.setState({ direction: 'left' })
      case 38: // up
        return this.setState({ direction: 'up' })
      case 39: // right
        return this.setState({ direction: 'right' })
      case 40: // down
        return this.setState({ direction: 'down' })
      default:
        return
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onDirectionSelect)
  }

  isFood = (row: number, column: number): boolean => {
    return (
      !!this.state.food &&
      this.state.food[0] === row &&
      this.state.food[1] === column
    )
  }

  isSnakePart = (row: number, column: number): boolean => {
    return !!this.state.snake.find(
      value => value[0] === row && value[1] === column,
    )
  }

  getNextSnake = (): Array<[number, number]> =>
    this.state.snake.map((value, index) => {
      const [row, column] = value
      if (index === 0) {
        switch (this.state.direction) {
          case 'left':
            return [row - 1, column]
          case 'right':
            return [row + 1, column]
          case 'down':
            return [row, column + 1]
          case 'up':
            return [row, column - 1]
          default:
            return [row, column]
        }
      } else {
        return this.state.snake[index - 1]
      }
    })

  isSnakeOutOfBounds = (headOfSnake: [number, number]): boolean => {
    const [row, column] = headOfSnake
    return (
      row < 0 ||
      row >= NUM_OF_ROWS ||
      column < 0 ||
      column >= NUM_OF_ROWS ||
      this.isSnakePart(row, column)
    )
  }

  didEatFood = (headOfSnake: [number, number]): boolean => {
    const [row, column] = headOfSnake
    return this.isFood(row, column)
  }

  getNewFood = (): [number, number] => {
    let newFood = [
      Math.floor(Math.random() * NUM_OF_ROWS),
      Math.floor(Math.random() * NUM_OF_ROWS),
    ]

    while (this.isSnakePart(newFood[0], newFood[1])) {
      newFood = [
        Math.floor(Math.random() * NUM_OF_ROWS),
        Math.floor(Math.random() * NUM_OF_ROWS),
      ]
    }
    return newFood
  }

  growSnake = () => {
    const snake = this.getNextSnake()
    return [...snake, this.state.snake[this.state.snake.length - 1]]
  }

  updateBoard = () => {
    const snake = this.getNextSnake()
    const isSnakeOutOfBounds = this.isSnakeOutOfBounds(snake[0])

    if (!isSnakeOutOfBounds) {
      const didEatFood = this.didEatFood(snake[0])
      const food = didEatFood ? this.getNewFood() : this.state.food
      this.setState({
        food,
        snake: didEatFood ? this.growSnake() : snake,
      })

      setTimeout(this.updateBoard, 300)
    } else {
      this.setState({
        gameStatus: 'end',
      })
    }
  }

  startGame = () => {
    this.setState(
      {
        food: this.getNewFood(),
        gameStatus: 'playing',
        snake: SNAKE_INIT,
      },
      () => this.updateBoard(),
    )
  }

  renderRow = (column: number): Array<Element<typeof Tile>> => {
    return [...new Array(NUM_OF_ROWS)].map((value, row) => {
      const colorClass = this.isSnakePart(row, column)
        ? styles.snakeColor
        : this.isFood(row, column)
          ? styles.foodColor
          : styles.defaultColor
      return <Tile className={colorClass} key={row} />
    })
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
          {[...new Array(NUM_OF_ROWS)].map((value, index) => (
            <div key={index} className={styles.row}>
              {this.renderRow(index)}
            </div>
          ))}
        </div>
        <button
          disabled={this.state.gameStatus === 'playing'}
          onClick={this.startGame}>
          Start Game
        </button>
      </div>
    )
  }
}

export default Board
