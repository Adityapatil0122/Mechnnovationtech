const CATALOG_SYNC_KEY = "mech_catalog_sync";
const CATALOG_CHANNEL = "mech_catalog_channel";

export function broadcastCatalogUpdate() {
  if (typeof window === "undefined") return;

  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CATALOG_CHANNEL);
      channel.postMessage({ type: "catalog-updated", at: Date.now() });
      channel.close();
    }
  } catch {
    // Ignore broadcast channel failures.
  }

  try {
    localStorage.setItem(CATALOG_SYNC_KEY, String(Date.now()));
  } catch {
    // Ignore storage failures.
  }
}

export function subscribeCatalogUpdates(onUpdate) {
  if (typeof window === "undefined") return () => {};

  let channel;
  const handleMessage = () => {
    onUpdate();
  };

  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(CATALOG_CHANNEL);
    channel.addEventListener("message", handleMessage);
  }

  const handleStorage = (event) => {
    if (event.key === CATALOG_SYNC_KEY) {
      onUpdate();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    if (channel) {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    }
    window.removeEventListener("storage", handleStorage);
  };
}
