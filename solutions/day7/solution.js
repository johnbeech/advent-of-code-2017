const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

const lineMatch = /([A-z]+) \((\d+)\)( -> )?([A-z, ]+)?/ // fwft (72) -> ktlj, cntj, xhth

function parseLine (line) {
  const breaks = line.match(lineMatch)
  const id = breaks[1]
  const weight = parseInt(breaks[2])
  const plates = (breaks[4] || '').trim().split(', ').filter(n => n)

  return {id, weight, plates}
}

function solve (input) {
  const plates = input.split(NL).filter(n => n).map(parseLine)
  const index = plates.reduce((index, item) => {
    index[item.id] = item
    return index
  }, {})

  plates.forEach((base) => {
    base.plates.forEach((child) => {
      index[child].parent = base.id
    })
  })

  const root = plates.filter(plate => !plate.parent)[0]

  const unbalanced = []

  function recurse (node) {
    node.plates = node.plates.map(id => index[id])
    node.plates.forEach(recurse)
    node.sum = node.weight + node.plates.reduce((acc, item) => acc + (item.sum || item.weight), 0)

    const frequencies = node.plates.reduce((acc, item) => {
      acc[item.sum] = (acc[item.sum] || 0) + 1
      return acc
    }, {})

    const unbalancedNode = node.plates.filter(p => frequencies[p.sum] === 1)[0]
    const balancedNode = node.plates.filter(p => frequencies[p.sum] > 1)[0]

    if (unbalancedNode) {
      unbalanced.push(unbalancedNode)
      unbalancedNode.adjust = unbalancedNode.sum - balancedNode.sum
      unbalancedNode.adjustedWeight = unbalancedNode.weight - (unbalancedNode.sum - balancedNode.sum)
    }
  }

  recurse(root)

  const lub = unbalanced.sort((a, b) => a.weight > b.weight ? 1 : -1)[0]

  function shorten (p) {
    return [p.id, p.weight, p.sum, p.adjust ? 'Adjusted weight: ' + p.adjustedWeight : 0].join(', ')
  }

  return {
    root: root.id, lub: [shorten(lub), lub.plates.map(shorten)]
  }
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solution1 = solve(input)
  const solution2 = solve(sampleinput)

  report(input, solution1)
  report(input, solution2)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution', ':', JSON.stringify(solution, null, 2))
}

try {
  run()
} catch (ex) {
  console.error('[Run]', ex, ex.stack)
}
