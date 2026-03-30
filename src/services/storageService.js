import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/config'

/**
 * Sube un PDF a Firebase Storage y devuelve su URL de descarga.
 */
export async function uploadPDF(uid, file) {
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `pdfs/${uid}/${timestamp}_${safeName}`
  const storageRef = ref(storage, path)

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: 'application/pdf',
  })

  const url = await getDownloadURL(snapshot.ref)
  return { url, path }
}
