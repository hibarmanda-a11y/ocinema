const legacyBrandPrefix = ['sanu', 'flix'].join('')

const getKeys = (suffix: string) => ({
  current: `ocinema_${suffix}`,
  legacy: `${legacyBrandPrefix}_${suffix}`,
})

export const getBrandStorageItem = (suffix: string): string | null => {
  const { current, legacy } = getKeys(suffix)
  const currentValue = localStorage.getItem(current)
  if (currentValue !== null) return currentValue

  const legacyValue = localStorage.getItem(legacy)
  if (legacyValue !== null) localStorage.setItem(current, legacyValue)
  return legacyValue
}

export const setBrandStorageItem = (suffix: string, value: string): void => {
  const { current } = getKeys(suffix)
  localStorage.setItem(current, value)
}

export const removeBrandStorageItem = (suffix: string): void => {
  const { current, legacy } = getKeys(suffix)
  localStorage.removeItem(current)
  localStorage.removeItem(legacy)
}
