const path = require('path')
const {read} = require('promise-path')
const NL = '\n'
const TAB = '\t'

function sum (arr) {
  return arr.reduce((acc, d) => acc + d, 0)
}

function solution1CheckSum (row) {
  const min = Math.min(...row)
  const max = Math.max(...row)
  return max - min
}

function findDivisor (cell, arr) {
  arr = [].concat(arr)
  while (arr.length > 0) {
    let next = arr.pop()
    if (next !== cell && cell / next === Math.round(cell / next)) {
      return next
    }
  }
  return 0
}

function solution2CheckSum (row) {
  return row.map(cell => {
    let divisor = findDivisor(cell, row)
    if (divisor) {
      return cell / divisor
    }
  }).filter(i => i)[0]
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const rows = input.trim().split(NL).map(row => row.split(TAB).map(cell => Number.parseInt(cell)))
  const solution1CheckSums = rows.map(solution1CheckSum)

  console.log('Solution 1 Checksums', solution1CheckSums.join(' : '))

  let solution1 = sum(solution1CheckSums)

  const solution2CheckSums = rows.map(solution2CheckSum)

  console.log('Solution 2 Checksums', solution2CheckSums.join(' : '))

  let solution2 = sum(solution2CheckSums)

  report(input, solution1, solution2)
}

function report (input, solution1, solution2) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution 1', ':', solution1)
  console.log('Advent of Code 2017 :', solutionName, 'solution 2', ':', solution2)
}

run()
