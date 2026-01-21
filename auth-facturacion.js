import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbL-p6MztAfyQzgRiVnPYPq5C8rHEbDq8",
  authDomain: "dks-facturacion.firebaseapp.com",
  projectId: "dks-facturacion",
  storageBucket: "dks-facturacion.firebasestorage.app",
  messagingSenderId: "821976151886",
  appId: "1:821976151886:web:2b126b7b5c9fb099da901f",
  measurementId: "G-3E8EM8KD7Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * VERIFICAR PERMISOS DINÁMICOS
 * Esta función ya no depende de un UID fijo, ahora consulta Firestore.
 */
export async function verificarPermisos() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Buscamos el documento del usuario en la colección 'users'
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        console.log(`Usuario identificado: ${userData.rol} de ${userData.empresa} 🏢`);
                        
                        // Devolvemos toda la data del usuario para que el sistema sepa qué empresa filtrar
                        resolve(userData); 
                    } else {
                        console.warn("Usuario logueado pero sin perfil en Firestore.");
                        resolve(null);
                    }
                } catch (error) {
                    console.error("Error al obtener permisos:", error);
                    resolve(null);
                }
            } else {
                // Si no hay nadie logueado y no estamos ya en el login, redirigir
                if (!window.location.pathname.includes("login.html")) {
                    window.location.href = "login.html";
                }
                resolve(null);
            }
        });
    });
}