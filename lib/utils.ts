export const round2 = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString()
  return doc
}

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
