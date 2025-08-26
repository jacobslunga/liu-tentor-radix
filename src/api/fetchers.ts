import apiClient from "./client";

export const fetcher = (url: string) =>
  apiClient.get(url).then((res) => res.data);

export const postFetcher = (url: string, data: any) =>
  apiClient.post(url, data).then((res) => res.data);
