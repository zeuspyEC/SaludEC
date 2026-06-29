import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@config/firebase'

export async function enviarMensaje({ nombre, email, asunto, mensaje }) {
  await addDoc(collection(db, 'mensajes'), {
    nombre,
    email,
    asunto,
    mensaje,
    fecha: serverTimestamp(),
    leido: false,
  })
}
