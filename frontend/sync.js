// ---- Local storage helpers ----

function getLocal(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeLocalId() {
  return "local_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
}

// ---- Queue a change for syncing ----

function queueChange(type, localId, payload) {
  const queue = getLocal("sync_queue");
  queue.push({
    queueId: "q_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
    type: type,
    localId: localId,
    payload: payload
  });
  setLocal("sync_queue", queue);
}

// ---- Map queue "type" to actual backend calls ----

async function sendToBackend(item) {
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  if (item.type === "create_customer") {
    const res = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(item.payload)
    });
    if (!res.ok) throw new Error("create_customer failed: " + res.status);
    return await res.json();
  }

  if (item.type === "create_loan") {
    const res = await fetch(`${API_BASE_URL}/loans`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(item.payload)
    });
    if (!res.ok) throw new Error("create_loan failed: " + res.status);
    return await res.json();
  }

  if (item.type === "create_payment") {
    const res = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(item.payload)
    });
    if (!res.ok) throw new Error("create_payment failed: " + res.status);
    return await res.json();
  }

  throw new Error("Unknown queue item type: " + item.type);
}

// ---- Replace a local temporary ID with the real backend ID ----

function replaceLocalId(storageKey, localId, realRecord) {
  const records = getLocal(storageKey);
  const updated = records.map(r => {
    if (r.id === localId) {
      return { ...realRecord, synced: true };
    }
    return r;
  });
  setLocal(storageKey, updated);
}

const STORAGE_KEY_BY_TYPE = {
  create_customer: "local_customers",
  create_loan: "local_loans",
  create_payment: "local_payments"
};

// ---- Process the sync queue ----

let isSyncing = false;

async function syncPendingChanges() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    let queue = getLocal("sync_queue");

    while (queue.length > 0) {
      const item = queue[0];

      // Remove the item BEFORE sending it, so an interrupted page
      // (navigation, refresh) can never see it and resend it again.
      queue = queue.slice(1);
      setLocal("sync_queue", queue);

      try {
        const realRecord = await sendToBackend(item);
        const storageKey = STORAGE_KEY_BY_TYPE[item.type];
        if (storageKey) {
          replaceLocalId(storageKey, item.localId, realRecord);
        }
      } catch (error) {
        // Failed (likely offline) - put it back at the front and stop.
        queue = getLocal("sync_queue");
        queue.unshift(item);
        setLocal("sync_queue", queue);
        console.log("Sync paused, will retry later:", error.message);
        break;
      }
    }
  } finally {
    isSyncing = false;
  }
}

// ---- Trigger sync automatically ----

window.addEventListener("online", syncPendingChanges);
document.addEventListener("DOMContentLoaded", syncPendingChanges);
