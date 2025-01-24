import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC0J5brG2rnootv4G-DS-zM6U_pVoJ58Zc",
    authDomain: "web-app-ita.firebaseapp.com",
    projectId: "web-app-ita",
    storageBucket: "web-app-ita.firebasestorage.app",
    messagingSenderId: "917032158446",
    appId: "1:917032158446:web:a92cc6b741ecc16049dfff",
    measurementId: "G-76LPCX5JEL"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Elementi DOM
const taskForm = document.getElementById('task-form');
const calendarEl = document.getElementById('calendar');

// Aggiungere una nuova attività
async function addTask(event) {
    event.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const taskType = document.getElementById('task-type').value;
    const taskDate = document.getElementById('task-date').value;
    const taskTime = document.getElementById('task-time').value;
    const taskEmail = document.getElementById('task-email').value;

    if (!taskName || !taskType || !taskDate || !taskTime || !taskEmail) {
        alert('Per favore, compila tutti i campi richiesti.');
        return;
    }

    try {
        await addDoc(collection(db, "tasks"), {
            name: taskName,
            type: taskType,
            date: taskDate,
            time: taskTime,
            email: taskEmail,
        });
        alert("Intervento aggiunto con successo!");
        taskForm.reset();
        renderCalendarEvents();
    } catch (error) {
        console.error("Errore durante il salvataggio:", error);
        alert("Errore durante il salvataggio dell'intervento.");
    }
}

// Mostrare gli eventi nel calendario
async function renderCalendarEvents() {
    const snapshot = await getDocs(collection(db, "tasks"));
    const events = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            title: `${data.name} - ${data.type}`,
            start: `${data.date}T${data.time}`,
        };
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        events: events,
    });
    calendar.render();
}

// Eventi
taskForm.addEventListener("submit", addTask);
document.addEventListener("DOMContentLoaded", renderCalendarEvents);

