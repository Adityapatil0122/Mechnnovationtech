const API_ROOT = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api").replace(/\/$/, "");

export const companyDetails = {
  name: "Mechnno Vation Technologies",
  email: "mechnnovationtechnologies@gmail.com",
  phone: "08047314415 Ext 9922",
  gstin: "27ABNFM1466C1Z9",
  experience: "12+ Years",
  address: "Shop No. 5, Sr. No. 38/1, Rajlaxmi Industrial Estate, Near Khudekar Industrial Estate, Narhe, Pune 411041",
  location: "Narhe, Pune 411041, Maharashtra"
};

async function parseResponse(response) {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Auto-clear stale admin token on 401 and redirect to login
    if (response.status === 401 && window.location.pathname.startsWith("/admin")) {
      localStorage.removeItem("mechnnovation_admin_token");
      window.location.href = "/admin/login";
      return;
    }
    const message = typeof payload === "string" ? payload : payload.error || "Request failed.";
    throw new Error(message);
  }

  return payload;
}

export async function apiRequest(path, { method = "GET", body, token, headers = {} } = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    method,
    headers: {
      ...(body && !(body instanceof FormData) && !(body instanceof Blob)
        ? { "content-type": "application/json" }
        : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body:
      body && !(body instanceof FormData) && !(body instanceof Blob)
        ? JSON.stringify(body)
        : body
  });

  return parseResponse(response);
}

export async function uploadFile(file) {
  const target = await apiRequest("/uploads/sign", {
    method: "POST",
    body: {
      fileName: file.name,
      contentType: file.type || "application/octet-stream"
    }
  });

  await fetch(target.uploadUrl, {
    method: target.method || "PUT",
    headers: target.headers || {},
    body: file
  });

  return target.fileUrl;
}

export { API_ROOT };
