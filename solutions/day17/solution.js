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

function singleLinkedCircularList (val) {
  const list = {}
  const start = {
    val
  }

  start.n = start

  function insertAfter (item, val) {
    const newItem = {
      val
    }
    newItem.n = item.n
    item.n = newItem
    list.length++
  }

  function print (pos) {
    let node = start
    let result = []
    do {
      let p = node === pos ? `(${node.val})` : node.val
      result.push(lp(p, 6, ' '))
      node = node.n
    } while (node !== start)
    console.log('[List]', result.join(' '))
  }

  list.insertAfter = insertAfter
  list.start = start
  list.length = 1
  list.print = print

  return list
}

function solve (item) {
  console.log('Item', item)

  let i = 0
  let j = 0
  const list = singleLinkedCircularList(0)
  let pos = list.start

  do {
    if (item.spinLength <= 10) {
      list.print(pos)
    }

    j = 0
    do {
      pos = pos.n
      j++
    } while (j < item.spinSize)
    list.insertAfter(pos, list.length)
    pos = pos.n
    i++
  } while (i < item.spinLength)

  const part1 = pos.n.val
  const part2 = '????'

  item.actual = 'Part 1: ' + part1 + ' ---> Part 2: ' + part2

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
