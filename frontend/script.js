// Point this at wherever your Express server is running.
const API_BASE = "http://localhost:3000";

const feedEl = document.getElementById("feed");
const feedCountEl = document.getElementById("feedCount");
const emptyStateEl = document.getElementById("emptyState");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

const postForm = document.getElementById("postForm");
const usernameInput = document.getElementById("usernameInput");
const contentInput = document.getElementById("contentInput");

const editOverlay = document.getElementById("editOverlay");
const editId = document.getElementById("editId");
const editUsername = document.getElementById("editUsername");
const editContent = document.getElementById("editContent");
const editCancel = document.getElementById("editCancel");
const editSave = document.getElementById("editSave");

let editingPostId = null;

// ---------- helpers ----------

function setStatus(state) {
  statusDot.classList.remove("live", "down");
  if (state === "live") {
    statusDot.classList.add("live");
    statusText.textContent = "connected";
  } else if (state === "down") {
    statusDot.classList.add("down");
    statusText.textContent = "server unreachable";
  } else {
    statusText.textContent = "connecting…";
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatId(id) {
  return "#" + String(id).padStart(3, "0");
}

// ---------- rendering ----------

function renderPosts(posts) {
  feedEl.innerHTML = "";

  if (!posts || posts.length === 0) {
    emptyStateEl.hidden = false;
    feedCountEl.textContent = "0 entries";
    return;
  }

  emptyStateEl.hidden = true;
  feedCountEl.textContent = `${posts.length} ${posts.length === 1 ? "entry" : "entries"}`;

  // newest first
  const ordered = [...posts].sort((a, b) => b.id - a.id);

  for (const post of ordered) {
    const card = document.createElement("article");
    card.className = "post-card";
    card.innerHTML = `
      <div class="post-top">
        <div class="post-meta">
          <span class="post-id">${formatId(post.id)}</span>
          <span class="post-user">@${escapeHtml(post.username || "anon")}</span>
        </div>
        <div class="post-actions">
          <button class="icon-btn" data-action="edit" data-id="${post.id}">edit</button>
          <button class="icon-btn danger" data-action="delete" data-id="${post.id}">delete</button>
        </div>
      </div>
      <p class="post-content">${escapeHtml(post.content || "")}</p>
    `;
    feedEl.appendChild(card);
  }
}

// ---------- API calls ----------

async function loadPosts() {
  try {
    const res = await fetch(`${API_BASE}/posts`);
    if (!res.ok) throw new Error("Failed to load posts");
    const posts = await res.json();
    setStatus("live");
    renderPosts(posts);
  } catch (err) {
    setStatus("down");
    console.error(err);
  }
}

async function createPost(username, content) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, content }),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

async function deletePost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}

async function updatePost(id, changes) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

// ---------- event wiring ----------

postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const content = contentInput.value.trim();
  if (!username || !content) return;

  try {
    await createPost(username, content);
    usernameInput.value = "";
    contentInput.value = "";
    await loadPosts();
  } catch (err) {
    console.error(err);
    setStatus("down");
  }
});

feedEl.addEventListener("click", async (e) => {
  const btn = e.target.closest(".icon-btn");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "delete") {
    try {
      await deletePost(id);
      await loadPosts();
    } catch (err) {
      console.error(err);
    }
  }

  if (action === "edit") {
    const card = btn.closest(".post-card");
    const currentUser = card.querySelector(".post-user").textContent.replace(/^@/, "");
    const currentContent = card.querySelector(".post-content").textContent;
    openEditor(id, currentUser, currentContent);
  }
});

function openEditor(id, username, content) {
  editingPostId = id;
  editId.textContent = formatId(id);
  editUsername.value = username;
  editContent.value = content;
  editOverlay.hidden = false;
  editUsername.focus();
}

function closeEditor() {
  editingPostId = null;
  editOverlay.hidden = true;
}

editCancel.addEventListener("click", closeEditor);

editOverlay.addEventListener("click", (e) => {
  if (e.target === editOverlay) closeEditor();
});

editSave.addEventListener("click", async () => {
  if (!editingPostId) return;
  const username = editUsername.value.trim();
  const content = editContent.value.trim();
  if (!username || !content) return;

  try {
    await updatePost(editingPostId, { username, content });
    closeEditor();
    await loadPosts();
  } catch (err) {
    console.error(err);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !editOverlay.hidden) closeEditor();
});

// ---------- init ----------

loadPosts();
setInterval(loadPosts, 10000); // light polling to stay in sync