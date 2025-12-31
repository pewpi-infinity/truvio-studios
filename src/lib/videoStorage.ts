/**
 * Video Storage using IndexedDB for persistent storage across sessions
 * This replaces the temporary blob URLs created by URL.createObjectURL()
 */

const DB_NAME = 'truvio-videos-db'
const DB_VERSION = 1
const STORE_NAME = 'videos'

interface StoredVideo {
  id: string
  videoBlob: Blob
  thumbnailDataUrl: string
  metadata: {
    title: string
    description: string
    hashtags: string[]
    createdAt: number
    ownerId: string
    fileName: string
    fileSize: number
    fileType: string
  }
}

/**
 * Initialize the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

/**
 * Store a video in IndexedDB
 */
export async function storeVideo(
  id: string,
  videoFile: File,
  thumbnailDataUrl: string,
  metadata: Omit<StoredVideo['metadata'], 'fileName' | 'fileSize' | 'fileType'>
): Promise<void> {
  const db = await openDB()
  
  const storedVideo: StoredVideo = {
    id,
    videoBlob: videoFile,
    thumbnailDataUrl,
    metadata: {
      ...metadata,
      fileName: videoFile.name,
      fileSize: videoFile.size,
      fileType: videoFile.type
    }
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(storedVideo)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
    
    transaction.oncomplete = () => db.close()
  })
}

/**
 * Retrieve a video from IndexedDB and create a persistent blob URL
 */
export async function getVideoUrl(id: string): Promise<string | null> {
  const db = await openDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const result = request.result as StoredVideo | undefined
      if (result?.videoBlob) {
        // Create a blob URL that will persist as long as the page is open
        const url = URL.createObjectURL(result.videoBlob)
        resolve(url)
      } else {
        resolve(null)
      }
    }
    
    transaction.oncomplete = () => db.close()
  })
}

/**
 * Retrieve video thumbnail from IndexedDB
 */
export async function getVideoThumbnail(id: string): Promise<string | null> {
  const db = await openDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const result = request.result as StoredVideo | undefined
      resolve(result?.thumbnailDataUrl || null)
    }
    
    transaction.oncomplete = () => db.close()
  })
}

/**
 * Delete a video from IndexedDB
 */
export async function deleteVideo(id: string): Promise<void> {
  const db = await openDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
    
    transaction.oncomplete = () => db.close()
  })
}

/**
 * Get all stored video IDs
 */
export async function getAllVideoIds(): Promise<string[]> {
  const db = await openDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAllKeys()
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result as string[])
    
    transaction.oncomplete = () => db.close()
  })
}

/**
 * Check if a video exists in storage
 */
export async function videoExists(id: string): Promise<boolean> {
  const db = await openDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(!!request.result)
    
    transaction.oncomplete = () => db.close()
  })
}
