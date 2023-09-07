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

export type ChatflowRequest = {
  chatflowid: string;
  apiHost?: string;
  tenantId?: string;
};

export type ChainRequest = {
  chatflowid: string;
  apiHost?: string;
  tenantId?: string;
  topic_id?: string;
  session_id?: string;
};

export type PredictRequest = {
  chatflowid: string;
  apiHost?: string;
  tenantId?: string;
  topic_id?: string;
  session_id?: string;
  body?: any;
};

export const initiateTopic = async ({ apiHost = "http://localhost:3000", body }: MessageRequest) => {
  await sendRequest<any>({
    method: "POST",
    url: `${apiHost}/api/v1/chatbot/topic-initiate`,
    body,
  });
};

export const sendMessageQuery = ({
  apiHost = "http://localhost:3000",
  tenantId,
  chatflowid,
  topic_id,
  session_id,
  body,
}: PredictRequest) =>
  sendRequest<any>({
    method: "POST",
    url: `${apiHost}/api/v1/chatflow/${chatflowid}/predict/${topic_id}/session/${session_id}`,
    body,
    tenantId,
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

export const tenantDBLoad = ({ chatflowid, apiHost, tenantId }: ChatflowRequest) => {
  return sendRequest<any>({
    method: "GET",
    url: `${apiHost}/api/v1/tenant/load-db`,
    tenantId,
  });
};

export const getChatflow = ({ chatflowid, apiHost = "http://localhost:3000", tenantId }: ChatflowRequest) => {
  return sendRequest<any>({
    method: "GET",
    url: `${apiHost}/api/v1/chatflow/${chatflowid}`,
    tenantId,
  });
};

export const createChain = ({
  chatflowid,
  apiHost = "http://localhost:3000",
  topic_id,
  session_id,
  tenantId,
}: ChainRequest) => {
  return sendRequest<any>({
    method: "POST",
    url: `${apiHost}/api/v1/chatflow/${chatflowid}/create-chain/topic/${topic_id}/session/${session_id}`,
    tenantId,
  });
};
