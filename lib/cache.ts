type CacheEntry = {
  data: any
  timestamp: number
}

const cache: Record<string, CacheEntry> = {}
const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000

export function getFromCache<T>(key: string, expirationTime = DEFAULT_CACHE_EXPIRATION): T | null {
  const entry = cache[key]
  if (!entry) return null

  const now = Date.now()
  if(now - entry.timestamp > expirationTime){
    delete cache[key]
    return null
  }

  return entry.data as T
}

export function storeInCache(key: string, data: any): void{
  cache[key] ={data, timestamp: Date.now(),}
}

export function clearCache(key?: string): void{
  if (key){
    delete cache[key]
  } 
  else{
    Object.keys(cache).forEach((k) => delete cache[k])
  }
}

export async function fetchWithCache<T>(fetchFn: () => Promise<T>, cacheKey: string, 
    expirationTime = DEFAULT_CACHE_EXPIRATION,): Promise<T> {
  const cachedData = getFromCache<T>(cacheKey, expirationTime)
  if(cachedData){
    return cachedData
  }

  const data = await fetchFn()
  storeInCache(cacheKey, data)
  return data
}
