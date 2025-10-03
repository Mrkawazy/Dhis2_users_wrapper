import { getApps } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

const app = window.__FIREBASE_APP__ || getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, updateDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword };

export function onSignOutClick(){ signOut(auth).then(()=> location.href='./auth/login.html'); }

export function guardDashboard({ onApproved, onPending }){
  onAuthStateChanged(auth, async (user)=>{
    if(!user){ location.href = './auth/login.html'; return; }
    try {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      const approved = snap.exists() && snap.data().approved === true;
      if(approved){ onApproved?.(user, snap.data()); } else { onPending?.(); await signOut(auth); }
    } catch(e){ console.error(e); location.href='./auth/login.html'; }
  });
}
