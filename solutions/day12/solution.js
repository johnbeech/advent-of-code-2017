const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

const connectionMatcher = /(\d+) <-> ([\d, ]+)/ // 4 <-> 2, 3, 6
function parseLine (line) {
  const matches = line.match(connectionMatcher)
  return {
    id: parseInt(matches[1]),
    connections: matches[2].split(', ').map(n => parseInt(n))
  }
}

function scan (node, group = {}) {
  if (group[node.id]) {
    return false
  }
  group[node.id] = true
  node.connections.forEach(n => scan(n, group))

  return Object.keys(group)
}

function solve (input) {
  const nodes = input.split(NL).map(n => n.trim()).filter(n => n).map(parseLine)

  const index = {}

  nodes.forEach(node => {
    index[node.id] = node
  })

  nodes.forEach(node => {
    node.connections = node.connections.map(n => index[n])
  })

  const group = scan(index[0])

  return {
    input,
    actual: group.length + ' : ' + group.join(', ')
  }
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')

  const solution = solve(input)
  const sampleSolution = solve(sampleinput)

  report(solution)
  report(sampleSolution)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ':', solution.actual)
}

run()
