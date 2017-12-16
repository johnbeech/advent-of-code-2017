const path = require('path')
const {read} = require('promise-path')

function parseInput (input) {
  const parts = input.trim().split(':')
  return {
    programs: parts[0],
    moves: parts[1].split(','),
    expected: parts[2],
    actual: false
  }
}

function solve (item) {
  let positions = item.programs.split('')

  function spin (move) {
    const steps = parseInt(move.replace('s', ''))
    const shift = positions.splice(-steps)
    positions = [].concat(shift, positions)
  }

  function exchange (move) {
    const parts = move.replace('x', '').split('/')
    const posA = parseInt(parts[0])
    const posB = parseInt(parts[1])

    const valA = positions[posA]
    const valB = positions[posB]

    positions[posA] = valB
    positions[posB] = valA
  }

  function partner (move) {
    const parts = move.replace('p', '').split('/')
    const prgA = parts[0]
    const prgB = parts[1]

    const posA = positions.indexOf(prgA)
    const posB = positions.indexOf(prgB)

    const valA = positions[posA]
    const valB = positions[posB]

    positions[posA] = valB
    positions[posB] = valA
  }

  const fns = {
    's': spin,
    'x': exchange,
    'p': partner
  }

  item.moves.forEach(move => {
    const l = move.charAt(0)
    const fn = fns[l]
    fn(move)
  })

  item.actual = positions.join('')

  return item
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  let solutions = [sampleinput, input].map(parseInput).map(solve)

  solutions.map(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.programs, ':', solution.actual, ':', solution.expected)
}

run()
