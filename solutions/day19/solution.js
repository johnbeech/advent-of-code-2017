const path = require('path')
const {read} = require('promise-path')
const solve = require('./solve')

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solutions = [sampleinput, input].map(solve)

  solutions.forEach(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.gridSize, ': Part 1 : ', solution.letters.join(''), ': Part 2 : ', solution.steps.length)
}

run()
