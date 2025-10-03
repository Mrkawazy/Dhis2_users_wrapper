import { auth, signInWithEmailAndPassword } from '../assets/auth.js';
const form = document.getElementById('loginForm');
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.href = '../index.html';
  } catch(err){
    alert(err.message || 'Sign-in failed');
  }
});
