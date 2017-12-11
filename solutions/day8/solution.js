const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

const instructionMatcher = /([A-z]+) (inc|dec) (-?\d+) if ([A-z]+) (>|<|<=|>=|==|!=) (-?\d+)/i // b inc 5 if a > 1
function parseInstruction (line) {
  const part = line.match(instructionMatcher) || []
  if (part.length === 0) {
    console.log('Unable to match', line)
    return false
  }

  return {
    operationRegister: part[1],
    operation: part[2],
    operationValue: parseInt(part[3]),
    conditionRegister: part[4],
    condition: part[5],
    conditionValue: parseInt(part[6])
  }
}

const conditionals = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,
  '==': (a, b) => a === b,
  '!=': (a, b) => a !== b
}

const operations = {
  'inc': (a, b) => a + b,
  'dec': (a, b) => a - b
}

function processInstruction (instruction, register) {
  register[instruction.operationRegister] = register[instruction.operationRegister] || 0
  register[instruction.conditionRegister] = register[instruction.conditionRegister] || 0

  const check = conditionals[instruction.condition]
  if (check(register[instruction.conditionRegister], instruction.conditionValue)) {
    const operation = operations[instruction.operation]
    register[instruction.operationRegister] = operation(register[instruction.operationRegister], instruction.operationValue)
  }
}

function solve (input) {
  const instructions = input.split(NL).map(n => n.trim()).filter(n => n).map(parseInstruction)

  const register = {}
  instructions.forEach(instruction => processInstruction(instruction, register))

  const maxRegister = Math.max(...Object.keys(register).map(key => register[key]))

  return maxRegister
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  let solution = solve(input)
  let samplesolution = solve(sampleinput)

  report(input, solution)
  report(sampleinput, samplesolution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
