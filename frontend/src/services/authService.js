const API_URL = "http://localhost:8081/api/auth";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.detail ||
      data.error ||
      "Something went wrong. Please try again."
    );
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
}

export async function registerCandidate(candidateData) {
  const response = await fetch(`${API_URL}/register/candidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidateData),
  });

  return handleResponse(response);
}

export async function registerRecruiter(recruiterData, document) {
  const formData = new FormData();

  Object.entries(recruiterData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append("document", document);

  const response = await fetch(`${API_URL}/register/recruiter`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(response);
}