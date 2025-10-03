import { auth, db, createUserWithEmailAndPassword, doc, setDoc, serverTimestamp } from '/assets/auth.js';

const f = document.getElementById('requestForm');
const done = document.getElementById('done');

f?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const nationalId = document.getElementById('nationalId').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password2').value;
  const reason = document.getElementById('reason').value.trim();

  if(password !== password2){ alert('Passwords do not match'); return; }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    await setDoc(doc(db, 'users', uid), {
      firstName, lastName, nationalId, phone, email, reason,
      approved: false,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    });
    done.textContent = 'Request submitted. An administrator will review and approve your access.';
    setTimeout(()=> location.href='/auth/login.html?pending=1', 1000);
  } catch(err){
    alert(err.message || 'Request failed');
  }
});
