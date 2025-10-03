import { auth, db, onSignOutClick } from '/assets/auth.js';
import { collection, query, where, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

const rows = document.getElementById('rows');
document.getElementById('logout').addEventListener('click', onSignOutClick);

function tr(u){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${u.firstName||''} ${u.lastName||''}</td>
    <td>${u.nationalId||''}</td>
    <td>${u.phone||''}</td>
    <td>${u.email||''}</td>
    <td>${u.reason||''}</td>
    <td>${u.approved?'<span class="pill">Approved</span>':'Pending'}</td>
    <td>
      <button class="btn small" data-act="approve" data-id="${u.id}">Approve</button>
      <button class="btn small" data-act="reject" data-id="${u.id}">Reject</button>
    </td>`;
  return tr;
}

async function load(){
  const q = query(collection(db, 'users'), where('approved','==', false));
  const snap = await getDocs(q);
  rows.innerHTML = '';
  snap.forEach(docu=>{
    const data = { id: docu.id, ...docu.data() };
    rows.appendChild(tr(data));
  });
}

rows.addEventListener('click', async (e)=>{
  const btn = e.target.closest('button[data-act]');
  if(!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.act;
  if(act==='approve'){
    await updateDoc(doc(db,'users',id),{ approved:true, updatedAt: new Date() });
    await load();
  } else if(act==='reject'){
    if(confirm('Reject and mark this request?')){
      await updateDoc(doc(db,'users',id),{ approved:false, rejected:true, updatedAt: new Date() });
      await load();
    }
  }
});

onAuthStateChanged(auth, (user)=>{
  if(!user){ location.href='/auth/login.html'; return; }
  document.getElementById('me').textContent = user.email || user.uid;
  load().catch(err=> alert(err.message || 'Failed to load'));
});
