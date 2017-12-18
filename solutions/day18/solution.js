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

function solvePart1 (item) {
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
    if (val(x) > 0) {
      pos = pos - 1 + val(y)
    }
  }

  console.log('--------------')
  console.log('--- PART 1 ---')
  console.log('--------------')

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
  item.expected = 'Recovered Frequencies ' + recoveredFrequencies.join(' # ')

  console.log('-------------')
  console.log('')

  return item
}

function solvePart2 (item) {
  const moves = item.moves

  function createProgram (programId, moves, programIndex) {
    const register = {
      p: programId
    }
    const messages = []

    const fns = {
      'snd': send,
      'rcv': receive,
      'set': setRegister,
      'add': increaseRegister,
      'mul': multiplyRegister,
      'mod': moduloRegister,
      'jgz': jump
    }

    let pos = 0
    let move
    let fn

    function val (y) {
      return parseInt(y) || register[y] || 0
    }

    // snd X sends the value of X to the other program.
    // These values wait in a queue until that program is ready to receive them.
    // Each program has its own message queue, so a program can never receive a message it sent.
    function send (x) {
      const otherProgram = programIndex[Math.abs(programId - 1)]
      const value = val(x)
      otherProgram.messages.push(value)

      program.sendCount = program.sendCount + 1
    }

    // rcv X receives the next value and stores it in register X.
    // If no values are in the queue, the program waits for a value to be sent to it.
    // Programs do not continue to the next instruction until they have received a value.
    // Values are received in the order they are sent.
    function receive (x) {
      if (messages.length > 0) {
        const value = messages.shift()
        register[x] = val(value)
        program.locked = false
      } else {
        program.locked = true
        pos = pos - 1
      }
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

    // jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
    function jump (x, y) {
      if (val(x) > 0) {
        pos = pos - 1 + val(y)
      }
    }

    // execute will execute the next instruction in the program.
    // Will return false when there are no more instructions to process.
    function execute () {
      move = moves[pos]
      if (move) {
        fn = fns[move.key]
        pos++
        fn(...move.args)
        console.log(`[P${programId}] [${pos}] [${move.key}] ${move.args} ::${messages}:: ${program.locked ? 'LOCKED' : ''}`)
      } else {
        program.terminated = true
        console.log(`[P${programId}] [${pos}] ::${messages.length}:: ${program.locked ? 'LOCKED' : ''} ${program.terminated ? 'TERMINATED' : ''}`)
      }
    }

    const program = {
      register,
      messages,
      execute,
      locked: false,
      terminated: false,
      sendCount: 0
    }

    return program
  }

  const programIndex = {}
  const p0 = createProgram(0, moves, programIndex)
  const p1 = createProgram(1, moves, programIndex)
  programIndex[0] = p0
  programIndex[1] = p1

  console.log('--------------')
  console.log('--- PART 2 ---')
  console.log('--------------')

  let deadlocked
  do {
    let x = Math.round(Math.random() * 10)
    let y = Math.round(Math.random() * 10)

    while (x > 0) {
      p1.execute()
      x--
    }

    while (y > 0) {
      p0.execute()
      y--
    }

    deadlocked = (p0.locked || p0.terminated) && (p1.locked || p1.terminated)
  } while (!deadlocked)

  item.actual = p1.sendCount
  item.expected = 'Send Count: ' + p1.sendCount

  console.log('-------------')
  console.log('Send count: ', p1.sendCount)
  console.log('-------------')
  console.log('')

  return item
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  let solutions1 = [sampleinput, input].map(parseInput).map(solvePart1)
  let solutions2 = [sampleinput, input].map(parseInput).map(solvePart2)

  solutions1.map(report)
  solutions2.map(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.programs, ':', solution.actual, ':', solution.expected)
}
run()
