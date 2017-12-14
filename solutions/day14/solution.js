const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function solve (key) {
  let squaresInUse = 0

  return {
    key,
    squaresInUse
  }
}

function print8x8 (solution) {
  const size = 8
  let row
  let key

  console.log('Solution for:', solution.key, ': Squares in use :', solution.squaresInUse)
  for (let j = 0; j < size; j++) {
    row = []
    for (let i = 0; i < size; i++) {
      key = `${i},${j}`
      row.push(solution[key] ? '#' : '.')
    }
    console.log(row.join(' '))
  }
  console.log('')
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  let solution = 'UNSOLVED'

  const keys = input.split(NL).map(n => n.trim()).filter(n => n)

  const solutions = keys.map(solve)

  solutions.map(print8x8)

  report(input, solution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
