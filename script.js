const editor = document.getElementById('editor');
const commentList = document.getElementById('commentList');
const wordCountDisplay = document.getElementById('wordCountDisplay');
let versionHistory = [];

// Load document from backend on page load
window.addEventListener('load', async () => {
    const response = await fetch('http://localhost:3000/document');
    const data = await response.json();
    editor.innerHTML = data.content || '';
});

// Autosave to backend on input
editor.addEventListener('input', async () => {
    const content = editor.innerHTML;
    localStorage.setItem('document', content);
    await fetch('http://localhost:3000/document', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });
    updateWordCount();
});

// Formatting functions
function formatDoc(command) {
    document.execCommand(command, false, null);
}

// Clear formatting
function clearFormatting() {
    document.execCommand('removeFormat', false, null);
}

// Change text color
function changeTextColor(color) {
    document.execCommand('foreColor', false, color);
}

// Change background color
function changeBGColor(color) {
    document.execCommand('hiliteColor', false, color);
}

// Download document as HTML file
function downloadDocument() {
    const content = editor.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Image uploader
function insertImage() {
    document.getElementById("imageUploader").click();
}

function uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.cursor = 'nwse-resize'; // Change cursor for resizing
        img.contentEditable = false; // Prevent editing the image
        editor.appendChild(img);
        // Resize functionality on image
        img.addEventListener('mousedown', initResize);
    };
    reader.readAsDataURL(file);
}

// Insert a table
function insertTable() {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.border = '1';
    for (let i = 0; i < 3; i++) {
        const row = table.insertRow();
        for (let j = 0; j < 3; j++) {
            const cell = row.insertCell();
            cell.contentEditable = true;
            cell.textContent = 'Cell ' + (i + 1) + ', ' + (j + 1);
        }
    }
    editor.appendChild(table);
}

// Function to insert a block quote
function insertBlockQuote() {
    const quote = document.createElement('blockquote');
    quote.textContent = prompt("Enter your quote:");
    editor.appendChild(quote);
}

// Export to PDF
function exportToPDF() {
    const element = document.getElementById('editor');
    html2pdf()
        .from(element)
        .save('document.pdf');
}

// Insert a link
function createLink() {
    const url = prompt("Enter the link URL:", "http://");
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

// Toggle comment box visibility
function toggleCommentBox() {
    const commentBox = document.getElementById("commentBox");
    commentBox.style.display = commentBox.style.display === "none" ? "block" : "none";
}

// Submit comment to comment list
function submitComment() {
    const commentText = document.getElementById("commentText").value;
    if (commentText) {
        const li = document.createElement("li");
        li.textContent = commentText;
        commentList.appendChild(li);
        document.getElementById("commentText").value = ""; // Clear input
        toggleCommentBox(); // Hide comment box
    } else {
        alert("Please enter a comment.");
    }
}

// Update word count display
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

// Undo function
function undo() {
    document.execCommand('undo', false, null);
}

// Redo function
function redo() {
    document.execCommand('redo', false, null);
}

// Function for image resizing
function initResize(e) {
    const img = e.target;
    window.addEventListener('mousemove', startResizing);
    window.addEventListener('mouseup', stopResizing);

    let originalWidth = img.clientWidth;
    let originalHeight = img.clientHeight;
    let originalMouseX = e.clientX;
    let originalMouseY = e.clientY;

    function startResizing(e) {
        const newWidth = originalWidth + (e.clientX - originalMouseX);
        const newHeight = originalHeight + (e.clientY - originalMouseY);
        img.style.width = `${newWidth}px`;
        img.style.height = `${newHeight}px`;
    }

    function stopResizing() {
        window.removeEventListener('mousemove', startResizing);
        window.removeEventListener('mouseup', stopResizing);
    }
}
