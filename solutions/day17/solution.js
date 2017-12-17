const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseLine (line) {
  const parts = line.split(':')
  return {
    input: line,
    spinSize: parseInt(parts[0]),
    spinLength: parseInt(parts[1])
  }
}

function parseInputs (input) {
  return input.split(NL).map(n => n.trim()).filter(n => n).map(parseLine)
}

function lp (str, len = 4, prefix = ' ') {
  str = str + ''
  while (str.length < len) {
    str = prefix + str
  }
  return str
}

function printState (result, pos) {
  console.log('[State]', result.map((n, i) => {
    const p = i === pos ? `(${n})` : n
    return lp(p, 6, ' ')
  }).join(' '))
}

function solve (item) {
  const result = [0]

  console.log('Item', item)

  let pos = 0
  let i = 0
  let val = 0

  do {
    if (item.spinLength <= 10) {
      printState(result, pos, val, i)
    }

    pos = (pos + item.spinSize) % result.length
    val = result.length
    result.splice(pos + 1, 0, val)
    pos = (pos + 1) % result.length
    i++
  } while (i < item.spinLength)

  const part1 = result[(pos + 1) % result.length]

  i = 1
  val = 0
  pos = 0

  do {
    pos = (pos + item.spinSize) % i
    if (pos === 0) {
      console.log('Pos:', pos, 'Val:', val)
      val = i
    }
    pos = pos + 1
    i++
  } while (i <= 50000000)

  const part2 = val

  item.actual = ['Part 1:', part1, 'Part 2:', part2].join(' ')

  return item
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solutions = parseInputs(input).map(solve)

  solutions.forEach(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ':', solution.actual)
}

run()
