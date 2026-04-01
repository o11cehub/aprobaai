import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext(null)

/**
 * Crea (o actualiza sin pisar) el documento del usuario en Firestore.
 * Usa merge:true para no sobreescribir si ya existe.
 */
async function ensureUserDoc(uid, email) {
  const ref = doc(db, 'users', uid)
  await setDoc(
    ref,
    {
      email,
      createdAt: serverTimestamp(),
      credits: 2,
      creditsResetAt: serverTimestamp(),
      totalProcessed: 0,
    },
    { merge: true }          // no sobreescribe campos existentes
  )
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function register(email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    // Espera a que el doc esté creado ANTES de resolver la promesa,
    // así el dashboard ya lo encuentra disponible.
    await ensureUserDoc(credential.user.uid, email)
    return credential
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = { user, loading, register, login, logout }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
