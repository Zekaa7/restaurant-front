export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("access_token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/";
    throw new Error("Unauthorized");
  }
  return res;
};
