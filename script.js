// ---- Note class ----
class Note {
  constructor(title, body) {
    this.id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    this.title = title;
    this.body = body;
  }
}

// ---- App state ----
const STORAGE_KEY = 'notesAppData';
let notes = [];
let searchTerm = '';
let editingNoteId = null;

// ---- DOM references ----
const noteForm = document.getElementById('noteForm');
const titleInput = document.getElementById('titleInput');
const bodyInput = document.getElementById('bodyInput');
const errorMsg = document.getElementById('errorMsg');
const notesGrid = document.getElementById('notesGrid');
const noteCount = document.getElementById('noteCount');
const emptyState = document.getElementById('emptyState');
const noResultsState = document.getElementById('noResultsState');
const searchInput = document.getElementById('searchInput');

const editModal = document.getElementById('editModal');
const editTitleInput = document.getElementById('editTitleInput');
const editBodyInput = document.getElementById('editBodyInput');
const editErrorMsg = document.getElementById('editErrorMsg');
const saveEditBtn = document.getElementById('saveEdit');
const cancelEditBtn = document.getElementById('cancelEdit');

// ---- Local Storage helpers ----
function loadNotes() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      notes = JSON.parse(stored);
    } catch (e) {
      notes = [];
    }
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ---- Rendering ----
function render() {
  notesGrid.innerHTML = '';

  let visibleNotes = notes;
  const term = searchTerm.trim().toLowerCase();
  if (term.length > 0) {
    visibleNotes = notes.filter(n =>
      n.title.toLowerCase().includes(term) || n.body.toLowerCase().includes(term)
    );
  }

  const hasAnyNotes = notes.length > 0;
  const hasVisibleNotes = visibleNotes.length > 0;

  emptyState.classList.toggle('hidden', hasAnyNotes);
  noResultsState.classList.toggle('hidden', !hasAnyNotes || hasVisibleNotes);

  visibleNotes.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.dataset.id = note.id;

    card.innerHTML = `
      <div class="note-title"></div>
      <div class="note-body"></div>
      <div class="note-actions">
        <button class="icon-btn edit-btn" title="Edit">✏️</button>
        <button class="icon-btn delete-btn" title="Delete">🗑️</button>
      </div>
    `;

    card.querySelector('.note-title').textContent = note.title;
    card.querySelector('.note-body').textContent = note.body;

    notesGrid.appendChild(card);
  });

  noteCount.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'}`;
}

// ---- Validation ----
function validateNote(title, body) {
  return title.trim().length > 0 && body.trim().length > 0;
}

// ---- Create note ----
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const body = bodyInput.value;

  if (!validateNote(title, body)) {
    errorMsg.textContent = 'Please enter both a title and note content.';
    return;
  }

  errorMsg.textContent = '';
  const newNote = new Note(title.trim(), body.trim());
  notes.unshift(newNote);
  saveNotes();
  render();

  titleInput.value = '';
  bodyInput.value = '';
  titleInput.focus();
});

titleInput.addEventListener('input', () => {
  if (errorMsg.textContent) errorMsg.textContent = '';
});
bodyInput.addEventListener('input', () => {
  if (errorMsg.textContent) errorMsg.textContent = '';
});

// ---- Search ----
searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value;
  render();
});

// ---- Notes grid interactions ----
notesGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.note-card');
  if (!card) return;
  const id = card.dataset.id;

  if (e.target.classList.contains('delete-btn')) {
    deleteNote(id);
  } else if (e.target.classList.contains('edit-btn')) {
    openEditModal(id);
  }
});

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  render();
}

// ---- Edit modal ----
function openEditModal(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  editingNoteId = id;
  editTitleInput.value = note.title;
  editBodyInput.value = note.body;
  editErrorMsg.textContent = '';
  editModal.classList.remove('hidden');
  editTitleInput.focus();
}

function closeEditModal() {
  editModal.classList.add('hidden');
  editingNoteId = null;
}

saveEditBtn.addEventListener('click', () => {
  const title = editTitleInput.value;
  const body = editBodyInput.value;
  if (!validateNote(title, body)) {
    editErrorMsg.textContent = 'Please enter both a title and note content.';
    return;
  }
  const note = notes.find(n => n.id === editingNoteId);
  if (note) {
    note.title = title.trim();
    note.body = body.trim();
    saveNotes();
    render();
  }
  closeEditModal();
});

cancelEditBtn.addEventListener('click', closeEditModal);

editModal.addEventListener('click', (e) => {
  if (e.target === editModal) closeEditModal();
});

editTitleInput.addEventListener('input', () => {
  if (editErrorMsg.textContent) editErrorMsg.textContent = '';
});
editBodyInput.addEventListener('input', () => {
  if (editErrorMsg.textContent) editErrorMsg.textContent = '';
});

// ---- Init ----
loadNotes();
render();
