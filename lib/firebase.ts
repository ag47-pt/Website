import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evita erro de build no Vercel quando variáveis de ambiente ainda não estão setadas
const isConfigValid = !!firebaseConfig.apiKey;
if (!isConfigValid) {
  console.warn('⚠️ FIREBASE API KEY MISSING! Using dummy config. Please check Vercel Environment Variables.');
}

const safeConfig = isConfigValid ? firebaseConfig : {
  apiKey: 'dummy-key-to-bypass-build-error',
  authDomain: 'dummy-domain',
  projectId: 'dummy-project',
  storageBucket: 'dummy-bucket',
  messagingSenderId: 'dummy-sender',
  appId: '1:123456789:web:abcdef',
};

// Inicializa o Firebase apenas se ele já não tiver sido inicializado (evita erros em dev)
const app = !getApps().length ? initializeApp(safeConfig) : getApp();

// Inicializa e exporta o Cloud Firestore
export const db = getFirestore(app);

// Inicializa e exporta o Firebase Auth
export const auth = getAuth(app);
