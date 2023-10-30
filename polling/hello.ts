import nanobuffer from './circle-buffer/circle-buffer'

const buffer = new nanobuffer<String>(4)

buffer.push('Apple')
buffer.push('Banana')
buffer.push('Cherry')
buffer.push('Durian')
buffer.push('Elderberry')
buffer.push('Fig')
console.log(buffer.maxSizeValue)

console.log(`Size after adding values: ${buffer.size}`) // Outputs: 3

// Iterating over values
console.log('Buffer Contents:')
for (let i = 0; i < buffer.size; i++) {
  console.log(buffer.get(i))
}
for (const fruit of buffer) {
  console.log(fruit)
}

console.log(Array.from(buffer))
