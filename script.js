document.addEventListener("DOMContentLoaded", function () {
    setupNavigation();
    fetchAuthors();
    fetchBooks();
    fetchCustomers();
    fetchOrders();
    fetchReports();
});

function setupNavigation() {
    document.querySelectorAll(".sidebar li").forEach(item => {
        item.addEventListener("click", function () {
            document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
            document.getElementById(item.dataset.section).classList.add("active");
        });
    });
}

// Fetch authors 
function fetchAuthors() {
    axios.get('https://bs-api.sobuj.net/view/authors/readAuthors.php')
        .then(response => {
            let authors = response.data;
            let html = `
                <table class="table table-bordered table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>SL</th>
                            <th>Author ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>`;

            authors.forEach((author, index) => {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${author.author_id}</td>
                        <td>${author.name}</td>
                        <td>${author.email}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-author" data-id="${author.author_id}" data-name="${author.name}" data-email="${author.email}" data-bs-toggle="modal" data-bs-target="#authorModal">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger delete-author" data-id="${author.author_id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>`;
            });

            html += `</tbody></table>`;
            document.getElementById('authorsList').innerHTML = html;
            document.querySelectorAll(".edit-author").forEach(btn => btn.addEventListener("click", showEditAuthorForm));
            document.querySelectorAll(".delete-author").forEach(btn => btn.addEventListener("click", deleteAuthor));
        })
        .catch(error => console.error("Error fetching authors:", error));
}

function showEditAuthorForm(event) {
    document.getElementById("authorId").value = event.target.dataset.author_id;
    document.getElementById("authorName").value = event.target.dataset.name;
    document.getElementById("authorEmail").value = event.target.dataset.email;
    document.getElementById("authorModalLabel").innerText = "Edit Author"; // Update modal title
}

//Author Add/Edit 
document.getElementById("authorFormElement").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const authorId = document.getElementById("authorId").value;
    const authorName = document.getElementById("authorName").value;
    const authorEmail = document.getElementById("authorEmail").value;

    if (!authorName || !authorEmail) {
        alert("Author name and email cannot be empty!");
        return;
    }

    const url = authorId 
        ? `https://bs-api.sobuj.net/view/authors/updateAuthor.php` 
        : `https://bs-api.sobuj.net/view/authors/createAuthor.php`;

    const payload = authorId 
        ? { author_id: authorId, name: authorName, email: authorEmail }
        : { name: authorName, email: authorEmail };

    axios.post(url, payload)
        .then(() => {
            alert(authorId ? "Author updated successfully!" : "Author added successfully!");
            fetchAuthors(); 
            var modal = bootstrap.Modal.getInstance(document.getElementById('authorModal'));
            modal.hide();
        })
        .catch(error => {
            console.error("Error saving author:", error.response || error); // Log full error
            alert("Error saving author. Please try again.");
        });
});


// Delete an author
function deleteAuthor(event) {
    const authorId = event.target.dataset.id;
    if (!confirm("Are you sure you want to delete this author?")) return;

    axios.post("https://bs-api.sobuj.net/view/authors/deleteAuthor.php", { author_id: authorId })
        .then(() => {
            alert("Author deleted successfully!");
            fetchAuthors(); 
        })
        .catch(error => {
            alert("Error deleting author. Please try again.");
            console.error("Error deleting author:", error);
        });
}

function fetchBooks() {
    axios.get('https://bs-api.sobuj.net/view/books/readBooks.php')
        .then(response => {
            let books = response.data;
            let html = '<table class="table"><thead><tr><th>ID</th><th>Title</th><th>Author ID</th><th>Price</th></tr></thead><tbody>';
            books.forEach(book => {
                html += `<tr>
                            <td>${book.book_id}</td>
                            <td>${book.title}</td>
                            <td>${book.author_id}</td>
                            <td>${book.price}</td>
                         </tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('booksList').innerHTML = html;
        })
        .catch(error => console.error("Error fetching books:", error));
}

function fetchCustomers() {
    axios.get('https://bs-api.sobuj.net/view/customers/readCustomers.php')
        .then(response => {
            let customers = response.data;
            let html = '<table class="table"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Address</th></tr></thead><tbody>';
            customers.forEach(customer => {
                html += `<tr>
                            <td>${customer.customer_id}</td>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.address}</td>
                         </tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('customersList').innerHTML = html;
        })
        .catch(error => console.error("Error fetching customers:", error));
}

function fetchOrders() {
    axios.get('https://bs-api.sobuj.net/view/orders/readOrders.php')
        .then(response => {
            let orders = response.data;
            let html = '<table class="table"><thead><tr><th>Order ID</th><th>Customer ID</th><th>Total</th></tr></thead><tbody>';
            orders.forEach(order => {
                html += `<tr>
                            <td>${order.order_id}</td>
                            <td>${order.customer_id}</td>
                            <td>${order.total_price}</td>
                         </tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('ordersList').innerHTML = html;
        })
        .catch(error => console.error("Error fetching orders:", error));
}

function fetchReports() {
    axios.get('https://bs-api.sobuj.net/view/reports/readReports.php')
        .then(response => {
            document.getElementById('reportSummary').innerHTML = `<pre>${JSON.stringify(response.data, null, 2)}</pre>`;
        })
        .catch(error => console.error("Error fetching reports:", error));
}

document.querySelectorAll(".cancel-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelector(".form-container").style.display = "none";
    });
});


