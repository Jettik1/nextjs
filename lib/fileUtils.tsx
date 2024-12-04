import fs from 'fs/promises'
import path from 'path'

export async function saveFiles(images: File[]): Promise<string[]> {
  const savedImages: string[] = []

  for (const image of images) {
    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer() // Получаем ArrayBuffer
      const buffer = new Uint8Array(arrayBuffer) // Преобразуем в Uint8Array
      const fileName = `${Date.now()}-${image.name}`
      const filePath = path.join(process.cwd(), 'public/images', fileName)

      // Сохраняем файл
      await fs.writeFile(filePath, buffer)

      // Добавляем путь к сохранённому файлу
      savedImages.push(`/images/${fileName}`)
    } else {
      console.error('Неизвестный тип изображения:', image)
    }
  }

  return savedImages
}
