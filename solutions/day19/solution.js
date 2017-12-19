const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

const exitsMap = {
  '|': [
    [0, -1],
    [0, 1]
  ],
  '-': [
    [-1, 0],
    [1, 0]
  ],
  '+': [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
  ]
}

function parseLine (line) {
  return line.split('')
}

function parseInput (input) {
  return input.trimRight().split(NL).map(n => n).map(parseLine)
}

function invert (val) {
  return val * -1
}

function solve (input) {
  const solution = {}

  const gridSize = {
    width: Math.max(...input.map(r => r.length)),
    height: input.length
  }

  function follow (pos) {
    let direction = pos.direction
    let exits = exitsMap[pos.symbol] || []
    let options = [[direction.x, direction.y]].concat(exits.filter(n => {
      return n[0] !== invert(direction.x) && n[1] !== invert(direction.y)
    })).map(n => {
      return {
        x: pos.x + n[0],
        y: pos.y + n[1],
        direction: {
          x: n[0],
          y: n[1]
        }
      }
    })

    return options.map(locate).filter(n => n)[0] || false
  }

  function locate (pos) {
    if (input[pos.y] && input[pos.y][pos.x] && input[pos.y][pos.x] !== ' ') {
      return {
        x: pos.x,
        y: pos.y,
        symbol: input[pos.y][pos.x],
        direction: pos.direction
      }
    }

    return false
  }

  const letters = []
  let pos = locate({x: input[0].indexOf('|'), y: 0, symbol: '|', direction: {x: 0, y: 1}})
  do {
    console.log(`[${pos.x}, ${pos.y}] ${pos.symbol}, D${pos.direction.x},${pos.direction.y}`)
    pos = follow(pos)
    if (pos && pos.symbol && !exitsMap[pos.symbol]) {
      letters.push(pos.symbol)
    }
  } while (pos)

  solution.letters = letters
  solution.gridSize = gridSize

  return solution
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solutions = [sampleinput, input].map(parseInput).map(solve)

  solutions.forEach(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.gridSize, ':', solution.letters.join(''))
}

run()
