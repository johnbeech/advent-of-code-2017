const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function walk (list) {
  let steps = 0
  let pos = 0

  let instruction
  do {
    instruction = list[pos]
    if (instruction !== undefined) {
      list[pos] = list[pos] + 1
      pos = pos + instruction
      steps = steps + 1
    } else {
      console.log('No instruction found at', pos, list[pos])
    }
  } while (instruction !== undefined)console.log('Result', list)

  return steps
}

function advancedWalk (list) {
  list = list.map(n => n)
  let steps = 0
  let pos = 0

  let instruction
  do {
    instruction = list[pos]
    if (instruction !== undefined) {
      if (instruction >= 3) {
        list[pos] = list[pos] - 1
      } else {
        list[pos] = list[pos] + 1
      }
      pos = pos + instruction
      steps = steps + 1
    } else {
      console.log('No instruction found at', pos, list[pos])
    }
  } while (instruction !== undefined)console.log('Result', list)

  return steps
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  let instructions1 = input.trim().split(NL).map(n => parseInt(n))
  let instructions2 = input.trim().split(NL).map(n => parseInt(n))

  let solution1 = walk(instructions1)
  let solution2 = advancedWalk(instructions2)

  report(input.length, solution1)
  report(input.length, solution2)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
