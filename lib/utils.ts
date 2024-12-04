export const round2 = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const convertDocToObj = (doc: any) => {
  const plainDoc = doc.toObject ? doc.toObject() : doc

  const converted = {
    ...plainDoc,
    _id: plainDoc._id?.toString(),
    createdAt:
      plainDoc.createdAt instanceof Date
        ? plainDoc.createdAt.toISOString()
        : plainDoc.createdAt || null,
    updatedAt:
      plainDoc.updatedAt instanceof Date
        ? plainDoc.updatedAt.toISOString()
        : plainDoc.updatedAt || null,
  }

  // Проверяем, есть ли поля типа Buffer и конвертируем их
  for (const key in converted) {
    if (Buffer.isBuffer(converted[key])) {
      converted[key] = converted[key].toString('base64')
    }
  }

  return converted
}

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export enum UserRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
}

export const PreferedRoles: UserRole[] = [
  UserRole.Owner,
  UserRole.Admin,
  UserRole.Moderator,
]
