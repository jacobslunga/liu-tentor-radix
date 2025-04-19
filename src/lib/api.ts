import axios from "axios";

export const api = axios.create({
  baseURL: "https://liutentor.lukasabbe.com/api/",
});
