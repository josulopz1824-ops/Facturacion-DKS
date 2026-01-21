import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    enableIndexedDbPersistence // <-- Para el modo offline
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * ACTIVAR PERSISTENCIA OFFLINE
 * Esto permite que DKS funcione sin internet usando la caché del dispositivo.
 */
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        // Probablemente múltiples pestañas abiertas
        console.warn("La persistencia falló: Múltiples pestañas abiertas.");
    } else if (err.code == 'unimplemented') {
        // El navegador no lo soporta (poco común hoy en día)
        console.warn("El navegador no soporta persistencia offline.");
    }
});

/**
 * VERIFICAR PERMISOS DINÁMICOS
 * Esta función asegura que el usuario esté logueado ANTES de devolver sus datos.
 */
export async function verificarPermisos() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe(); 
            
            if (user) {
                try {
                    console.log("🔥 Autenticación detectada, verificando perfil...");
                    const userRef = doc(db, "users", user.uid);
                    
                    // Gracias a la persistencia, esto funcionará incluso offline 
                    // si ya se había consultado antes.
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        console.log(`✅ Usuario identificado: ${userData.rol} de ${userData.empresa}`);
                        resolve(userData); 
                    } else {
                        console.warn("⚠️ Usuario sin perfil en Firestore.");
                        resolve(null);
                    }
                } catch (error) {
                    console.error("❌ Error al obtener datos:", error);
                    resolve(null);
                }
            } else {
                console.log("🚫 No hay usuario logueado.");
                if (!window.location.pathname.includes("login.html")) {
                    window.location.href = "login.html";
                }
                resolve(null);
            }
        });
    });
}
