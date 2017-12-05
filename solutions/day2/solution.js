const path = require('path')
const {read} = require('promise-path')
const NL = '\n'
const TAB = '\t'

function sum (arr) {
  return arr.reduce((acc, d) => acc + d, 0)
}

function calculateCheckSum(row) {
  const min = Math.min(...row)
  const max = Math.max(...row)
  return max - min
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const rows = input.trim().split(NL).map(row => row.split(TAB).map(cell => Number.parseInt(cell)))
  const rowCheckSums = rows.map(calculateCheckSum)

  let solution = sum(rowCheckSums)

  report(input, solution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', NL, input, ':', solution)
}

run()
