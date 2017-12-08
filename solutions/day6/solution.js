const path = require('path')
const {read} = require('promise-path')
const TAB = '\t'

function distribute (blocks) {
  blocks = [].concat(blocks)
  const highestBlock = Math.max(...blocks)
  const startIndex = blocks.indexOf(highestBlock)

  let portions = blocks[startIndex]

  // console.log('Start Index', startIndex, highestBlock)

  blocks[startIndex] = 0

  const portionSize = 1
  let index
  let i = 0
  while (portions > 0) {
    i++
    index = (startIndex + i) % blocks.length
    portions = portions - portionSize
    // console.log('Changing', index, 'from', blocks[index], 'to', (blocks[index] + portionSize))
    blocks[index] = blocks[index] + portionSize
  }

  return blocks
}

function solve (blocks) {
  let history = {}
  let solved = false
  let key
  do {
    key = blocks.join(':')
    if (history[key]) {
      solved = true
      console.log('Solve at:', blocks, 'after', Object.keys(history).length, 'steps')
    } else {
      history[key] = true
      console.log(' Step to:', blocks)
      blocks = distribute(blocks)
    }
  } while (!solved)

  return {
    history: Object.keys(history),
    blocks
  }
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  let blocks = input.trim().split(TAB).map(n => parseInt(n.trim()))

  // blocks = [0, 2, 7, 0]

  let solution1 = solve(blocks)
  let solution2 = solve(solution1.blocks)

  report(blocks, solution1.history.length)
  report(blocks, solution2.history.length)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
