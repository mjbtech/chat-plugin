import { MessageType } from "@/components/Bot";
import { sendMultipartRequest, sendRequest } from "@/utils/index";

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
  userSessionId?: string;
};

export type UserSessionRequest = {
  apiHost?: string;
  tenantId?: string;
  session_id?: string;
  body?: any;
};

export type ReviewRequest = {
  apiHost?: string;
  tenantId?: string;
  chatflow_id: string;
  topic_id?: string;
  user_email?: string;
  question?: string;
  answer?: string;
  feedback?: string;
  rating?: number;
};

export type SpeechRecognitionRequest = {
  apiHost?: string;
  tenantId?: string;
  body?: FormData;
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
  userSessionId,
}: PredictRequest) =>
  sendRequest<any>({
    method: "POST",
    url: `${apiHost}/api/v1/chatflow/${chatflowid}/predict/${topic_id}/session/${session_id}?userSessionId=${userSessionId}`,
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

export const createUserSessionRequest = ({ apiHost = "http://localhost:3000", body, tenantId }: UserSessionRequest) => {
  return sendRequest<any>({
    method: "POST",
    url: `${apiHost}/api/v1/user-session`,
    body,
    tenantId,
  });
};

export const getUserSession = ({ apiHost, tenantId, session_id }: UserSessionRequest) => {
  return sendRequest<any>({
    method: "GET",
    url: `${apiHost}/api/v1/user-session/${session_id}`,
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

export const postReview = async ({ apiHost = "http://localhost:3000", tenantId, ...rest }: ReviewRequest) => {
  return await sendRequest<any>({
    method: "POST",
    url: `${apiHost}/api/v1/review`,
    tenantId,
    body: rest,
  });
};

export const speechRecognition = async ({
  apiHost = "http://localhost:3000",
  tenantId,
  body,
}: SpeechRecognitionRequest) => {
  return await sendMultipartRequest<any>({
    method: "POST",
    url: `${apiHost}/api/v1/common/speech-recognize`,
    body: body,
    tenantId,
  });
};
