import apiClient from "../../shared/lib/apiClient";
import type { Resource, SlackChannel } from "../../shared/types";

export const getResources = async (): Promise<Resource[]> => {
  const response = await apiClient.get<Resource[]>("/resources");
  return response.data;
};

export const getSlackChannels = async (): Promise<SlackChannel[]> => {
  const response = await apiClient.get<SlackChannel[]>("/slack-channels");
  return response.data;
};
