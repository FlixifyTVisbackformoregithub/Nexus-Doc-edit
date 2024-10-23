// Basic autosave functionality
const editor = document.getElementById('editor');

editor.addEventListener('input', () => {
    localStorage.setItem('document', editor.value);
});

window.addEventListener('load', () => {
    editor.value = localStorage.getItem('document') || '';
});
