const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseTestLine (line) {
  const parts = line.split(' is ')
  return {
    path: parts[0].split(','),
    expected: parts[1]
  }
}

const directions = {
  'n': {x: 0, y: -1},
  's': {x: 0, y: 1},
  'ne': {x: 1, y: 0},
  'nw': {x: -1, y: -1},
  'se': {x: 1, y: 1},
  'sw': {x: -1, y: 0}
}

function solve (test) {
  test.actual = 0

  const position = {
    x: 0,
    y: 0
  }

  test.path.forEach(step => {
    const direction = directions[step]
    if (direction) {
      position.x = position.x + direction.x
      position.y = position.y + direction.y
    } else {
      console.log(`"${step}" is not a valid direction`)
    }
  })

  test.position = position
  test.stepDistance = (Math.abs(position.x) + Math.abs(position.y) + Math.abs(position.x - position.y)) / 2
  test.actual = test.stepDistance + ' ? ' + JSON.stringify(position)

  return test
}

function parseTests (input) {
  return input.split(NL).map(n => n.trim()).filter(n => n).map(parseTestLine)
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  parseTests(input).map(solve).forEach(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.path.join(','), solution.actual, '?=', solution.expected)
}

run()
