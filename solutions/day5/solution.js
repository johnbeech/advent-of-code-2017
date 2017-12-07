const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function walk (list) {
  let steps = 0
  let pos = 0

  console.log('List', list)

  do {
    instruction = list[pos]
    if (instruction !== undefined) {
      list[pos] = list[pos] + 1
      pos = pos + instruction
      steps = steps + 1
    } else {
      console.log('No instruction found at', pos, list[pos])
    }
  } while (instruction !== undefined)

  console.log('Result', list)

  return steps
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  let instructions = input.trim().split(NL).map(n => parseInt(n))

  let solution = walk(instructions)

  report(input.length, solution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
