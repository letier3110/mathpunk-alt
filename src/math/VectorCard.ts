interface VectorCardProps {
  name: string
  size?: number
}

interface IVectorCard {
  setCount(count: Array<number>): void
  getId(): number
  getName(): string
  getDescription(): string
  getCount(): Array<number>
  getSize(): number
}

export class VectorCard implements IVectorCard {
  private id: number
  private name: string
  private count: Array<number>
  private size: number
  constructor({ name, size = 1 }: VectorCardProps) {
    this.name = name
    this.count = Array(size).fill(0)
    this.size = size
    this.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  }

  setCount(count: Array<number>) {
    this.count = count
  }

  getId() {
    return this.id
  }

  setName(name: string) {
    this.name = name
  }

  getName() {
    return this.name.toString()
  }

  // getCountNumber() {
  //   if(this.count < 0) return `(-${Math.abs(this.count)})`
  //   return this.count.toString()
  // }

  getCount() {
    return this.count
  }

  getDescription() {
    return this.name
  }

  getSize() {
    return this.size
  }

  getIsInteractive() {
    return false
  }

  static isSameSize(a: VectorCard, b: VectorCard) {
    return a.getSize() === b.getSize()
  }
}
