import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from '../firebase/config'

// ── Créditos ──────────────────────────────────────────────────────────────────

/**
 * Devuelve el estado de créditos del usuario.
 * Reinicia a 2 si pasó más de 30 días desde el último reset.
 */
export async function getUserCredits(uid) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Usuario no encontrado')

  const data = snap.data()
  const now = Date.now()
  const resetAt = data.creditsResetAt?.toMillis?.() ?? 0
  const thirtyDays = 30 * 24 * 60 * 60 * 1000

  if (now - resetAt > thirtyDays) {
    await updateDoc(ref, {
      credits: 2,
      creditsResetAt: serverTimestamp(),
    })
    return 2
  }

  return data.credits ?? 0
}

/**
 * Descuenta 1 crédito. Lanza error si no hay créditos.
 */
export async function consumeCredit(uid) {
  const credits = await getUserCredits(uid)
  if (credits <= 0) throw new Error('Sin créditos disponibles este mes')

  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    credits: increment(-1),
    totalProcessed: increment(1),
  })
}

// ── Resultados ────────────────────────────────────────────────────────────────

/**
 * Guarda los resultados generados por OpenAI para un PDF.
 */
export async function saveResult(uid, fileName, results) {
  const ref = collection(db, 'users', uid, 'results')
  const docRef = await addDoc(ref, {
    fileName,
    createdAt: serverTimestamp(),
    ...results,
  })
  return docRef.id
}

/**
 * Trae todos los resultados del usuario, ordenados por fecha desc.
 */
export async function getUserResults(uid) {
  const ref = collection(db, 'users', uid, 'results')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Devuelve un resultado específico.
 */
export async function getResultById(uid, resultId) {
  const ref = doc(db, 'users', uid, 'results', resultId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Resultado no encontrado')
  return { id: snap.id, ...snap.data() }
}
