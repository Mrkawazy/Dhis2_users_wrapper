import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
const firebaseConfig = {
  apiKey: "AIzaSyCRSW-xPFpuMQQ-3RQp80jqrv4_Rop-eto",
  authDomain: "dhis2-wrapper.firebaseapp.com",
  projectId: "dhis2-wrapper",
  storageBucket: "dhis2-wrapper.firebasestorage.app",
  messagingSenderId: "952882072799",
  appId: "1:952882072799:web:faa821420e559cc101ad6a",
  measurementId: "G-ELBEWBZD69"
};
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
