const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const digits = input.trim().split('').map((d) => Number.parseInt(d))
  const nextDigit = (from) => digits[(from + 1) % digits.length]

  const usefulDigits = digits.filter((d, i) => d === nextDigit(i))

  console.log('Useful digits:', usefulDigits.join(', '), NL)

  let solution = usefulDigits.reduce((acc, d) => acc + d, 0)

  report(input, solution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
