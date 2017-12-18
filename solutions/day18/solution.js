const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseMove (line) {
  const parts = line.split(' ')

  return {
    key: parts.shift(),
    args: parts
  }
}

function parseInput (input) {
  const moves = input.trim().split(NL).map(parseMove)
  return {
    moves
  }
}

function solve (item) {
  const moves = item.moves
  const register = {}
  const recoveredFrequencies = []
  const fns = {
    'snd': playSound,
    'set': setRegister,
    'add': increaseRegister,
    'mul': multiplyRegister,
    'mod': moduloRegister,
    'rcv': recoverFrequency,
    'jgz': jump
  }

  let lastSoundPlayed = 0
  let pos = 0
  let move
  let fn

  function val (y) {
    return parseInt(y) || register[y] || 0
  }

  // snd X plays a sound with a frequency equal to the value of X.
  function playSound (x) {
    lastSoundPlayed = val(x)
  }

  // set X Y sets register X to the value of Y.
  function setRegister (x, y) {
    register[x] = val(y)
  }

  // add X Y increases register X by the value of Y.
  function increaseRegister (x, y) {
    register[x] = (register[x] || 0) + val(y)
  }

  // mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
  function multiplyRegister (x, y) {
    register[x] = (register[x] || 0) * val(y)
  }

  // mod X Y sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
  function moduloRegister (x, y) {
    register[x] = (register[x] || 0) % val(y)
  }

  // rcv X recovers the frequency of the last sound played, but only when the value of X is not zero. (If it is zero, the command does nothing.)
  function recoverFrequency (x) {
    if (register[x]) {
      recoveredFrequencies.push(lastSoundPlayed)
    }
  }

  // jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
  function jump (x, y) {
    if (register[x] > 0) {
      pos = pos - 1 + parseInt(y)
    }
  }

  do {
    move = moves[pos]
    if (move) {
      fn = fns[move.key]
      pos++
      fn(...move.args)
      console.log(`[${pos}] [${move.key}] ${move.args}`)
    }
  } while (move && !recoveredFrequencies.length)

  item.actual = recoveredFrequencies[0]
  item.expected = '???? ' + recoveredFrequencies.join(' # ')

  console.log('-------------')
  console.log('')

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
