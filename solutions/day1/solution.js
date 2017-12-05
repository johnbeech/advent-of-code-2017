const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function sum (arr) {
  return arr.reduce((acc, d) => acc + d, 0)
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const digits = input.trim().split('').map((d) => Number.parseInt(d))
  const nextDigit = (from, offset = 1) => digits[(from + offset) % digits.length]

  const solution1Digits = digits.filter((d, i) => d === nextDigit(i))

  console.log('Solution 1 Digits:', solution1Digits.join(', '), NL)

  let solution1 = sum(solution1Digits)

  const solution2Digits = digits.filter((d, i) => d === nextDigit(i, digits.length / 2))

  console.log('Solution 2 Digits:', solution1Digits.join(', '), NL)

  let solution2 = sum(solution2Digits)

  report(input, solution1, solution2)
}

function report (input, solution1, solution2) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for part1', ':', solution1)
  console.log('Advent of Code 2017 :', solutionName, 'solution for part2', ':', solution2)
}

run()
