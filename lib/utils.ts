export const round2 = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const convertDocToObj = (doc: any) => {
  const plainDoc = doc.toObject ? doc.toObject() : doc // Преобразуем только если это Mongoose документ
  // чтобы обойтись без преобразования лучше использовать метод .lean() при получении объектов из Mongoose
  return {
    ...plainDoc,
    _id: plainDoc._id?.toString(), // Преобразуем ObjectId в строку
    createdAt:
      plainDoc.createdAt instanceof Date
        ? plainDoc.createdAt.toISOString()
        : plainDoc.createdAt || null, // Проверяем является ли созданная дата объектом Date
    updatedAt:
      plainDoc.updatedAt instanceof Date
        ? plainDoc.updatedAt.toISOString()
        : plainDoc.updatedAt || null, // Проверяем является ли обновлённая дата объектом Date
  }
}

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
