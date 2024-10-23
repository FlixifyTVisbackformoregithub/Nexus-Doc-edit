const editor = document.getElementById('editor');
const commentList = document.getElementById('commentList');
const wordCountDisplay = document.getElementById('wordCountDisplay');
let findReplaceBox = document.getElementById('findReplaceBox');

// Load document content
window.addEventListener('load', () => {
    editor.innerHTML = localStorage.getItem('document') || '';
});

// Autosave document on input
editor.addEventListener('input', () => {
    const content = editor.innerHTML;
    localStorage.setItem('document', content);
    updateWordCount();
});

// Change font family or size
function changeFont(type) {
    const value = document.getElementById(type).value;
    if (type === 'fontFamily') {
        document.execCommand('fontName', false, value);
    } else {
        document.execCommand('fontSize', false, value);
    }
}

// Formatting functions
function formatDoc(command) {
    document.execCommand(command, false, null);
}

// Clear formatting
function clearFormatting() {
    document.execCommand('removeFormat', false, null);
}

// Insert horizontal line
function insertHorizontalLine() {
    const hr = document.createElement('hr');
    editor.appendChild(hr);
}

// Change text color
function changeTextColor(color) {
    document.execCommand('foreColor', false, color);
}

// Insert page break
function insertPageBreak() {
    const br = document.createElement('div');
    br.style.pageBreakAfter = 'always';
    editor.appendChild(br);
}

// Image handling
function insertImage() {
    document.getElementById("imageUploader").click();
}

function uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'resizable';
        img.contentEditable = false;  // Prevent editing the image
        img.addEventListener('click', function () {
            this.remove(); // Delete image on click
        });
        makeImageResizable(img);
        editor.appendChild(img);
    };
    reader.readAsDataURL(file);
}

// Make image resizable
function makeImageResizable(img) {
    let isResizing = false;
    let originalWidth = img.clientWidth;
    let originalHeight = img.clientHeight;

    img.addEventListener('mousedown', (e) => {
        isResizing = true;
        originalWidth = img.clientWidth;
        originalHeight = img.clientHeight;

        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', () => {
            isResizing = false;
            window.removeEventListener('mousemove', resize);
        });
    });

    function resize(e) {
        if (isResizing) {
            const newWidth = originalWidth + (e.movementX);
            const newHeight = originalHeight + (e.movementY);
            img.style.width = `${newWidth}px`;
            img.style.height = `${newHeight}px`;
        }
    }
}

// Download document as HTML file
function downloadDocument() {
    const content = editor.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
}

// Export to PDF
function exportToPDF() {
    const element = document.getElementById('editor');
    html2pdf()
        .from(element)
        .save('document.pdf');
}

// Export to DOCX
function exportToDOCX() {
    const element = document.getElementById('editor');
    const exportContent = new Blob([element.innerHTML], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(exportContent);
    link.download = 'document.docx';
    link.click();
}

// Insert table
function insertTable() {
    const rows = parseInt(prompt("Enter number of rows:", "3"));
    const cols = parseInt(prompt("Enter number of columns:", "3"));
    const table = document.createElement('table');
    table.style.width = '100%';
    table.border = '1';
    for (let i = 0; i < rows; i++) {
        const row = table.insertRow();
        for (let j = 0; j < cols; j++) {
            const cell = row.insertCell();
            cell.contentEditable = true;
            cell.textContent = 'Cell ' + (i + 1) + ', ' + (j + 1);
        }
    }
    editor.appendChild(table);
}

// Create link
function createLink() {
    const url = prompt("Enter the link URL:", "http://");
    if (url) {
        const selectedText = window.getSelection().toString();
        const a = document.createElement('a');
        a.href = url;
        a.innerText = selectedText || url;
        a.target = '_blank';
        document.execCommand("insertHTML", false, a.outerHTML);
    }
}

// Reset Document
function resetDocument() {
    if (confirm("Are you sure you want to reset the document?")) {
        editor.innerHTML = "";
        localStorage.removeItem('document');
        updateWordCount();
    }
}

// Update word count
function updateWordCount() {
    const text = editor.innerText || "";
    const words = text.match(/\w+/g);
    const count = words ? words.length : 0;
    wordCountDisplay.textContent = `Word Count: ${count}`;
}

// Show the current word count
function showWordCount() {
    updateWordCount();
}

// Undo functionality
function undo() {
    document.execCommand('undo', false, null);
}

// Redo functionality
function redo() {
    document.execCommand('redo', false, null);
}

// Find and Replace
function findAndReplace() {
    findReplaceBox.style.display = 'block';
}

function closeFindReplace() {
    findReplaceBox.style.display = 'none';
}

function replaceText() {
    const findText = document.getElementById('findText').value;
    const replaceText = document.getElementById('replaceText').value;
    const innerHTML = editor.innerHTML.replace(new RegExp(findText, 'g'), replaceText);
    editor.innerHTML = innerHTML;
}
