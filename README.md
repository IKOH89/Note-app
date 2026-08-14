# Notes Application

A simple, responsive digital notebook for writing, editing, organizing, and deleting personal notes. Built with plain HTML, CSS, and JavaScript — no frameworks or build tools required.

## Features

- Create new notes with a title and body
- Display all saved notes in a grid
- Edit existing notes
- Delete notes
- Search notes by title or keyword (live filtering)
- Notes persist between visits using browser Local Storage
- Input validation (empty title or body is rejected, with an error message shown)
- Responsive layout that works on mobile and desktop

## How to Run

1. Download or clone this repository.
1. Open `index.html` in any web browser (double-click the file, or right-click → Open With → your browser).
1. That’s it — no installation, server, or build step needed.

**Optional (VS Code Live Server):**
If you have the “Live Server” extension in VS Code, right-click `index.html` and choose “Open with Live Server” for auto-reload while editing.

## Project Structure

```
notes-app/
├── index.html      # Page structure
├── style.css       # Styling and responsive layout
├── script.js       # App logic (create, edit, delete, search, storage)
└── README.md       # This file
```

## Notes on Implementation

- Notes are stored as objects (`id`, `title`, `body`) in an array, saved to `localStorage` under the key `notesAppData` and reloaded automatically on page load.
- The `Note` class handles creation of new note objects, satisfying the “at least one class with at least one method” requirement.
- Search filters notes live as you type, checking both the title and body text.
- Editing is handled through a modal dialog to keep validation and cancel/save actions clear.
- Note text is inserted using `textContent` (not `innerHTML`) to avoid injecting raw HTML from user input.
