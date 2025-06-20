document.addEventListener('DOMContentLoaded', function() {
    const docForm = document.getElementById('documentForm');
    const docType = document.getElementById('docType');
    const clientName = document.getElementById('clientName');
    const docDate = document.getElementById('docDate');
    const docFile = document.getElementById('docFile');
    const docNotes = document.getElementById('docNotes');
    const documentList = document.getElementById('documentList');
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    const noDocumentsMessage = document.getElementById('noDocumentsMessage');

    let documents = JSON.parse(localStorage.getItem('caDocuments')) || [];

    displayDocuments(documents);

    docForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newDocument = {
            id: Date.now(),
            type: docType.value,
            client: clientName.value.trim(),
            date: docDate.value,
            filename: docFile.files[0]?.name || 'No file',
            notes: docNotes.value.trim()
        };

        documents.push(newDocument);
        saveDocuments();
        docForm.reset();
        displayDocuments(documents);
        alert('Document added successfully!');
    });

    searchInput.addEventListener('input', filterDocuments);
    filterSelect.addEventListener('change', filterDocuments);

    documentList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const documentId = parseInt(e.target.closest('tr').dataset.id);
            if (confirm('Are you sure you want to delete this document?')) {
                documents = documents.filter(doc => doc.id !== documentId);
                saveDocuments();
                displayDocuments(documents);
            }
        }
    });

    function saveDocuments() {
        localStorage.setItem('caDocuments', JSON.stringify(documents));
    }

    function filterDocuments() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        let filteredDocs = documents;

        if (filterValue !== 'ALL') {
            filteredDocs = filteredDocs.filter(doc => doc.type === filterValue);
        }

        if (searchTerm) {
            filteredDocs = filteredDocs.filter(doc =>
                doc.client.toLowerCase().includes(searchTerm) ||
                doc.notes.toLowerCase().includes(searchTerm)
            );
        }

        displayDocuments(filteredDocs);
    }

    function displayDocuments(docs) {
        documentList.innerHTML = '';

        if (docs.length === 0) {
            noDocumentsMessage.style.display = 'block';
            return;
        }

        noDocumentsMessage.style.display = 'none';

        docs.forEach(doc => {
            const row = document.createElement('tr');
            row.dataset.id = doc.id;

            row.innerHTML = `
                <td>${doc.type}</td>
                <td>${doc.client}</td>
                <td>${new Date(doc.date).toLocaleDateString()}</td>
                <td>
                    <button class="delete-btn" title="Delete document">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            documentList.appendChild(row);
        });
    }
});
