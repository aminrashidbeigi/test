// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClh1f6wxdcKLWbyEv9S8l0WbrdJ58LtsU",
    authDomain: "wedding-notes-f6918.firebaseapp.com",
    databaseURL: "https://wedding-notes-f6918-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wedding-notes-f6918",
    storageBucket: "wedding-notes-f6918.firebasestorage.app",
    messagingSenderId: "486184553258",
    appId: "1:486184553258:web:87586f16a688e5e52b6c53"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time.
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            // The current browser doesn't support persistence
            console.log('The current browser doesn\'t support persistence');
        }
    });

// Notes functionality
document.addEventListener('DOMContentLoaded', function () {
    const noteForm = document.getElementById('note-form');
    const notesContainer = document.getElementById('notes-container');

    // Load notes from Firebase
    loadNotes();

    // Handle form submission
    noteForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const note = document.getElementById('note').value;
        const date = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Create note object
        const noteObj = {
            name: name,
            note: note,
            date: date,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Save note to Firebase
        saveNote(noteObj);

        // Clear form
        noteForm.reset();
    });

    function saveNote(noteObj) {
        db.collection('notes').add(noteObj)
            .then(() => {
                console.log('Note saved successfully');
            })
            .catch((error) => {
                console.error('Error saving note:', error);
                alert('Sorry, there was an error saving your note. Please try again.');
            });
    }

    function loadNotes() {
        // Listen for real-time updates
        db.collection('notes')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                notesContainer.innerHTML = '';

                snapshot.forEach((doc) => {
                    const note = doc.data();
                    const noteElement = createNoteElement(note);
                    notesContainer.appendChild(noteElement);
                });

                // Trigger animation for new notes
                const newNotes = notesContainer.querySelectorAll('.note-item');
                newNotes.forEach(note => {
                    note.style.opacity = '1';
                    note.style.transform = 'translateY(0)';
                });
            }, (error) => {
                console.error('Error loading notes:', error);
                notesContainer.innerHTML = '<p class="text-center">Sorry, there was an error loading notes. Please try again later.</p>';
            });
    }

    function createNoteElement(note) {
        const div = document.createElement('div');
        div.className = 'note-item';
        div.style.opacity = '0';
        div.style.transform = 'translateY(20px)';
        div.style.transition = 'all 0.5s ease';

        // Function to detect Persian/Arabic text
        function hasPersianText(text) {
            const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
            return persianRegex.test(text);
        }

        // Check if name or note contains Persian text
        const nameIsPersian = hasPersianText(note.name);
        const noteIsPersian = hasPersianText(note.note);
        const dateIsPersian = hasPersianText(note.date);

        div.innerHTML = `
            <div class="note-content">
                <h4 ${nameIsPersian ? 'dir="rtl"' : ''}>${note.name}</h4>
                <p ${noteIsPersian ? 'dir="rtl"' : ''}>${note.note}</p>
                <small ${dateIsPersian ? 'dir="rtl"' : ''}>${note.date}</small>
            </div>
        `;
        return div;
    }
}); 