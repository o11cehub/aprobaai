# AprobaAI

Plataforma de estudio con IA: subí un PDF y obtenés resumen, machete, conceptos clave y preguntas de examen automáticamente.

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Auth / DB / Storage:** Firebase (Auth, Firestore, Storage)
- **IA:** OpenAI GPT-4o-mini vía Firebase Cloud Functions
- **Deploy:** Vercel (frontend) + Firebase Functions (backend)

---

## Correr en local

```bash
# 1. Clonar
git clone https://github.com/o11cehub/aprobaai.git
cd aprobaai

# 2. Variables de entorno
cp .env.example .env
# Completar .env con tus valores de Firebase y la URL de la Cloud Function

# 3. Instalar dependencias
npm install

# 4. Desarrollo
npm run dev
# → http://localhost:5173
```

---

## Deploy en Vercel

### 1. Importar el repo en Vercel
- Ir a [vercel.com/new](https://vercel.com/new)
- Conectar el repositorio `o11cehub/aprobaai`
- Framework: **Vite** (se detecta automáticamente)

### 2. Configurar variables de entorno en Vercel
En **Settings → Environment Variables**, agregar:

| Variable | Valor |
|---|---|
| `VITE_FIREBASE_API_KEY` | Tu API key de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | `tu-proyecto.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `tu-proyecto-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `tu-proyecto.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Tu sender ID |
| `VITE_FIREBASE_APP_ID` | Tu app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Tu measurement ID |
| `VITE_PROCESS_PDF_URL` | URL de tu Cloud Function |

> Las variables `VITE_*` se inyectan en el bundle en tiempo de build.

### 3. Deploy automático
Cada push a `main` dispara un nuevo deploy en Vercel.

---

## Deploy de Firebase Cloud Functions

```bash
# Instalar Firebase CLI (si no lo tenés)
npm install -g firebase-tools

# Login
firebase login
firebase use tu-proyecto-id

# Guardar la API key de OpenAI como Secret
firebase functions:secrets:set OPENAI_API_KEY
# → Ingresar el valor: sk-...

# Instalar dependencias de functions
cd functions && npm install && cd ..

# Deploy
firebase deploy --only functions

# La URL resultante va en VITE_PROCESS_PDF_URL
```

---

## Reglas de Firebase

```bash
# Deploy de reglas de Firestore y Storage
firebase deploy --only firestore:rules,storage:rules
```
