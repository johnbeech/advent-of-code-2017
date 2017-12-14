const salt = [17, 31, 73, 47, 23]

function bitwiseBlock (array, blockSize) {
  const result = []
  for (let i = 0; i < blockSize; i++) {
    result[i] = 0
    for (let j = 0; j < blockSize; j++) {
      result[i] = result[i] ^ array[(i * blockSize) + j]
    }
  }
  return result
}

function readCircularSection (array, start, distance) {
  const result = []
  for (let i = 0; i < distance; i++) {
    let index = (start + i) % array.length
    result.push(array[index])
  }
  return result
}

function setCircularSection (array, start, data) {
  for (let i = 0; i < data.length; i++) {
    let index = (start + i) % array.length
    array[index] = data[i]
  }
}

function zp (str) {
  if (str.length < 2) {
    return '0' + str
  }
  return str
}

function hexCode (value) {
  return zp(value.toString(16))
}

function calculateKnotHash (input) {
  const values = []
  const lengths = input.split('').map(n => (n + '').charCodeAt(0)).concat(...salt)

  let skipSize = 0
  let position = 0

  while (values.length < 256) {
    values.push(values.length)
  }

  for (let r = 0; r < 64; r++) {
    lengths.forEach(length => {
      const section = readCircularSection(values, position, length)
      section.reverse()
      setCircularSection(values, position, section)

      position = position + skipSize + length
      skipSize++
    })
  }

  const sparseHash = [].concat(values)
  const denseHash = bitwiseBlock(sparseHash, 16)
  const knotHash = denseHash.map(hexCode).join('')

  return knotHash
}

module.exports = calculateKnotHash
