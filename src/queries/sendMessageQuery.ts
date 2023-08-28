import { MessageType } from "@/components/Bot";
import { sendRequest } from "@/utils/index";

export type IncomingInput = {
  question: string;
  history: MessageType[];
  overrideConfig?: Record<string, unknown>;
  socketIOClientId?: string;
};

export type MessageRequest = {
  chatflowid: string;
  apiHost?: string;
  body?: any;
};

export const initiateTopic = async ({ apiHost = "http://localhost:3000", body }: MessageRequest) => {
  await sendRequest<any>({
    method: "POST",
    url: `${apiHost}/api/v1/chatbot/topic-initiate`,
    body,
  });
};

export const sendMessageQuery = ({ apiHost = "http://localhost:3000", body }: MessageRequest) =>
  sendRequest<any>({
    method: "POST",
    url: `${apiHost}/api/v1/chatbot/prediction`,
    body,
  });

export const isStreamAvailableQuery = ({ chatflowid, apiHost = "http://localhost:3000" }: MessageRequest) =>
  sendRequest<any>({
    method: "GET",
    url: `${apiHost}/api/v1/chatflows-streaming/${chatflowid}`,
  });

export const getOptions = ({ chatflowid, apiHost = "http://localhost:3000", body }: MessageRequest) =>
  sendRequest<any>({
    method: "GET",
    url: `${apiHost}/api/v1/topics/${chatflowid}`,
    body,
  });
