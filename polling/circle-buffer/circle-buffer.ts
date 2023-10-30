class CircleBuffer<T> {
  private buffer: (T | undefined)[]
  private maxSize: number
  private start: number = 0
  private end: number = 0
  private count: number = 0

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize
    this.buffer = new Array(maxSize)
  }

  push(value: T): CircleBuffer<T> {
    this.buffer[this.end] = value
    if (++this.count > this.maxSize) {
      this.count = this.maxSize
      this.start = (this.start + 1) % this.maxSize
    }
    this.end = (this.end + 1) % this.maxSize
    return this
  }

  clear(): CircleBuffer<T> {
    this.start = 0
    this.end = 0
    this.count = 0
    return this
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.count) {
      throw new Error('Index out of bounds')
    }
    return this.buffer[(this.start + index) % this.maxSize]
  }

  get size(): number {
    return this.count
  }

  get maxSizeValue(): number {
    return this.maxSize
  }

  set maxSizeValue(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('maxSize must be an integer greater than 0')
    }
    if (value < this.count) {
      const newData = new Array(value)
      for (let i = 0; i < value; i++) {
        newData[i] = this.buffer[(this.start + i) % this.maxSize]
      }
      this.buffer = newData
      this.start = 0
      this.end = this.count = value
    } else if (value > this.maxSize) {
      const newData = new Array(value)
      for (let i = 0; i < this.count; i++) {
        newData[i] = this.buffer[(this.start + i) % this.maxSize]
      }
      this.buffer = newData
      this.start = 0
      this.end = this.count
      this.maxSize = value
    }
  }

  [Symbol.iterator](): Iterator<T> {
    let index = 0
    return {
      next: (): IteratorResult<T> => {
        if (index < this.count) {
          const result = {
            value: this.buffer[(this.start + index) % this.maxSize] as T,
            done: false,
          }
          index++
          return result
        } else {
          return {done: true, value: null}
        }
      },
    }
  }
}

export default CircleBuffer
