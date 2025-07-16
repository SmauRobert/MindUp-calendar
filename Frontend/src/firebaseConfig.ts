import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyCE5B_nbAUgi4PdciyDfn9xk_s9tuENL3g',
    authDomain: 'mindup-calendar.firebaseapp.com',
    projectId: 'mindup-calendar',
    storageBucket: 'mindup-calendar.firebasestorage.app',
    messagingSenderId: '167344426623',
    appId: '1:167344426623:web:e3218115856bdf559f794a',
    measurementId: 'G-PPS8RTHQ83',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
