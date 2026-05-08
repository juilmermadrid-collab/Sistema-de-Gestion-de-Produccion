<<<<<<< HEAD
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

=======
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

>>>>>>> b6f21f12907c6b74880c37a26e2130ebe4ebec93
export default api;