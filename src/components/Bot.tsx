import { BotMessageTheme, TextInputTheme, UserMessageTheme } from "@/features/bubble/types";
import { Popup } from "@/features/popup";
import {
  createChain,
  getChatflow,
  sendMessageQuery,
  tenantDBLoad,
  createUserSessionRequest,
  getUserSession,
} from "@/queries/sendMessageQuery";
import socketIOClient from "socket.io-client";
import { For, createEffect, createSignal, onMount } from "solid-js";
import { Badge } from "./Badge";
import { BotBubble } from "./bubbles/BotBubble";
import { GuestBubble } from "./bubbles/GuestBubble";
import { LoadingBubble } from "./bubbles/LoadingBubble";
import { LoginPrompt } from "./bubbles/LoginPrompt";
import { OptionBubble } from "./bubbles/OptionBubble";
import { SourceBubble } from "./bubbles/SourceBubble";
import { Header } from "./header/Header";
import { TextInput } from "./inputs/textInput";
import { getCookie, setCookie } from "../utils/cookieUtil";

type messageType = "apiMessage" | "userMessage" | "usermessagewaiting" | "option";

export type MessageType = {
  message: string;
  type: messageType;
  sourceDocuments?: any;
};

export type BotProps = {
  chatflowid: string;
  tenantId?: string;
  apiHost?: string;
  chatflowConfig?: Record<string, unknown>;
  welcomeMessage?: string;
  botMessage?: BotMessageTheme;
  userMessage?: UserMessageTheme;
  textInput?: TextInputTheme;
  poweredByTextColor?: string;
  badgeBackgroundColor?: string;
  poweredByVisibility?: boolean;
  fontSize?: number;
  header?: {
    title?: string;
    subTitle?: string;
    backgroundColor?: string;
    textColor?: string;
    avatar?: string;
    avatarStyle?: any;
  };
  loginPrompt?: { field_name: string; is_required: boolean }[];
  submitButtonBackground?: string;
  submitIcon?: Node;
  iconBackground?: string;
};

const defaultWelcomeMessage = "Hi there! How can I help?";

const selectOptionMessage = "Please choose an 👇 option to continue";

export const Bot = (props: BotProps & { class?: string; onMax?: () => void; isMax?: boolean }) => {
  let chatContainer: HTMLDivElement | undefined;
  let bottomSpacer: HTMLDivElement | undefined;
  let botContainer: HTMLDivElement | undefined;

  const [userInput, setUserInput] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [sourcePopupOpen, setSourcePopupOpen] = createSignal(false);
  const [sourcePopupSrc, setSourcePopupSrc] = createSignal({});
  const [topics, setTopics] = createSignal<any[]>([]);
  const [poweredByVisibility, setPoweredByVisibility] = createSignal(true);
  const [messages, setMessages] = createSignal<MessageType[]>(
    [
      {
        message: props.welcomeMessage ?? defaultWelcomeMessage,
        type: "apiMessage",
      },
    ],
    { equals: false }
  );
  const [socketIOClientId, setSocketIOClientId] = createSignal("");
  const [isChatFlowAvailableToStream, setIsChatFlowAvailableToStream] = createSignal(false);
  const [selectedTopic, setSelectedTopic] = createSignal<any>({});
  const [userSession, setUserSession] = createSignal<any>(null);
  const [sessionLoading, setSessionLoading] = createSignal<boolean>(true);

  createEffect(async () => {
    const { chatflowid, apiHost, tenantId } = props;
    await tenantDBLoad({ chatflowid, apiHost, tenantId });
    const cookieVal = getCookie("session_user");
    let cookieUser = cookieVal ? JSON.parse(cookieVal) : null;

    if (cookieUser) {
      setUserSession(cookieUser);
      // const { data } = await getUserSession({ apiHost, tenantId, session_id: cookieUser.data?._id });
      // if (data?.data) {
      //   setUserSession(data.data);
      // }
    }
    setSessionLoading(false);
  });

  const createUserSession = async (values: any) => {
    let body = {
      email: values.Email,
      createdAt: new Date(),
      meta_data: values,
    };
    const { data: response } = await createUserSessionRequest({
      apiHost: props.apiHost,
      tenantId: props.tenantId,
      body,
    });
    if (response?.data) {
      setCookie("session_user", JSON.stringify(response.data), 30);
      setUserSession(response.data);
    }
  };

  onMount(() => {
    if (!bottomSpacer) return;
    setTimeout(() => {
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    }, 50);
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    }, 50);
  };

  const fetchTopics = async () => {
    const { chatflowid, apiHost, tenantId } = props;
    const { data } = await getChatflow({ chatflowid, apiHost, tenantId });
    if (data?.data?.chatbot_theme) setPoweredByVisibility(data?.data?.chatbot_theme?.powered_by_visibility);
    setTopics(data.data.topics);
    if (data.data.topics.length === 1) {
      optionSelect(data.data.topics[0].name);
    } else {
      setMessages((prev) => {
        return [
          ...prev,
          { message: selectOptionMessage, type: "apiMessage" },
          { message: data.data.topics.map((topic: any) => topic.name).join(","), type: "option" },
        ];
      });
    }
    scrollToBottom();
  };

  createEffect(() => {
    if (userSession()) {
      fetchTopics();
    }
  }, [userSession()]);

  const updateLastMessage = (text: string) => {
    setMessages((data) => {
      const updated = data.map((item, i) => {
        if (i === data.length - 1) {
          return { ...item, message: item.message + text };
        }
        return item;
      });
      return [...updated];
    });
  };

  const updateLastMessageSourceDocuments = (sourceDocuments: any) => {
    setMessages((data) => {
      const updated = data.map((item, i) => {
        if (i === data.length - 1) {
          return { ...item, sourceDocuments: sourceDocuments };
        }
        return item;
      });
      return [...updated];
    });
  };

  // Handle errors
  const handleError = (message = "Oops! There seems to be an error. Please try again.") => {
    setMessages((prevMessages) => [...prevMessages, { message, type: "apiMessage" }]);
    setLoading(false);
    setUserInput("");
    scrollToBottom();
  };

  // Handle form submission
  const handleSubmit = async (value: string) => {
    setUserInput(value);

    if (value.trim() === "") {
      return;
    }

    if (!Object.keys(selectedTopic()).length) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: "Please choose an option to continue", type: "apiMessage" },
      ]);
      return;
    }

    setLoading(true);
    scrollToBottom();

    // Send user question and history to API
    const welcomeMessage = props.welcomeMessage ?? defaultWelcomeMessage;
    const messageList = messages().filter((msg) => msg.message !== welcomeMessage);

    setMessages((prevMessages) => [...prevMessages, { message: value, type: "userMessage" }]);

    // const body: any = {
    //   question: value,
    //   socket_id: socketIOClientId(),
    //   topic_id: selectedTopic()._id,
    //   tenant_id: props.chatflowid,
    // };

    // if (props.chatflowConfig) body.overrideConfig = props.chatflowConfig

    // if (isChatFlowAvailableToStream()) body.socketIOClientId = socketIOClientId();

    const result = await sendMessageQuery({
      chatflowid: props.chatflowid,
      apiHost: props.apiHost,
      tenantId: props.tenantId,
      session_id: socketIOClientId(),
      userSessionId: userSession()?._id,
      topic_id: selectedTopic()._id,
      body: {
        question: value,
      },
    });

    if (result.data) {
      const data = handleVectaraMetadata(result.data);

      if (typeof data === "object" && data.text && data.sourceDocuments) {
        if (!isChatFlowAvailableToStream()) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: data.text, sourceDocuments: data.sourceDocuments, type: "apiMessage" },
          ]);
        }
      } else {
        if (!isChatFlowAvailableToStream())
          setMessages((prevMessages) => [...prevMessages, { message: data, type: "apiMessage" }]);
      }
      setLoading(false);
      setUserInput("");
      scrollToBottom();
    }
    if (result.error) {
      const error = result.error;
      console.error(error);
      const err: any = error;
      const errorData = err.response.data || `${err.response.status}: ${err.response.statusText}`;
      handleError(errorData);
      return;
    }
  };

  // Auto scroll chat to bottom
  createEffect(() => {
    if (messages()) scrollToBottom();
  });

  createEffect(() => {
    if (props.fontSize && botContainer) botContainer.style.fontSize = `${props.fontSize}px`;
  });

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    let socket: any;
    if (!socketIOClientId().length) {
      const data = { isStreaming: true };

      if (data) {
        setIsChatFlowAvailableToStream(data?.isStreaming ?? false);
      }

      socket = socketIOClient(props.apiHost as string, {
        path: "/chat/stream",
      });

      socket.on("connect", () => {
        setSocketIOClientId(socket.id);
      });

      socket.on("startChat", () => {
        setMessages((prevMessages) => [...prevMessages, { message: "", type: "apiMessage" }]);
      });

      socket.on("sourceDocuments", updateLastMessageSourceDocuments);

      socket.on("message", updateLastMessage);
    }

    // eslint-disable-next-line solid/reactivity
    return () => {
      setUserInput("");
      setLoading(false);
      setMessages([
        {
          message: props.welcomeMessage ?? defaultWelcomeMessage,
          type: "apiMessage",
        },
      ]);
      if (socket) {
        socket.disconnect();
        setSocketIOClientId("");
      }
    };
  });

  const isValidURL = (url: string): URL | undefined => {
    try {
      return new URL(url);
    } catch (err) {
      return undefined;
    }
  };

  const handleVectaraMetadata = (message: any): any => {
    if (message.sourceDocuments && message.sourceDocuments[0].metadata.length) {
      message.sourceDocuments = message.sourceDocuments.map((docs: any) => {
        const newMetadata: { [name: string]: any } = docs.metadata.reduce((newMetadata: any, metadata: any) => {
          newMetadata[metadata.name] = metadata.value;
          return newMetadata;
        }, {});
        return {
          pageContent: docs.pageContent,
          metadata: newMetadata,
        };
      });
    }
    return message;
  };

  const removeDuplicateURL = (message: MessageType) => {
    const visitedURLs: string[] = [];
    const newSourceDocuments: any = [];

    message = handleVectaraMetadata(message);

    message.sourceDocuments.forEach((source: any) => {
      if (isValidURL(source.metadata.source) && !visitedURLs.includes(source.metadata.source)) {
        visitedURLs.push(source.metadata.source);
        newSourceDocuments.push(source);
      } else if (!isValidURL(source.metadata.source)) {
        newSourceDocuments.push(source);
      }
    });
    return newSourceDocuments;
  };

  const optionSelect = async (option: string) => {
    const topic = topics().find((topic) => topic.name === option);
    if (topic) {
      setLoading(true);
      scrollToBottom();

      await createChain({
        tenantId: props.tenantId,
        chatflowid: props.chatflowid,
        apiHost: props.apiHost,
        topic_id: topic._id,
        session_id: socketIOClientId(),
      });

      setSelectedTopic(topic);
      setLoading(false);
      scrollToBottom();
      setMessages((prev) => {
        return [
          ...prev,
          { message: option, type: "userMessage" },
          { message: `Please post your query on : ${option}`, type: "apiMessage" },
        ];
      });
    }
  };

  const gotoTopic = async () => {
    await fetchTopics();
  };

  return (
    <>
      <div
        ref={botContainer}
        class={
          "relative flex w-full h-full text-base overflow-hidden bg-cover bg-center flex-col items-center chatbot-container " +
          props.class
        }
      >
        <Header
          avatar={props.header?.avatar}
          backgroundColor={props.header?.avatar}
          subTitle={props.header?.subTitle}
          title={props.header?.title}
          gotoTopic={gotoTopic}
          onMax={props.onMax}
          isMax={props.isMax}
        />
        <div class="flex w-full h-full justify-center">
          <div
            style={{ "padding-bottom": "160px" }}
            ref={chatContainer}
            class="overflow-y-scroll min-w-full w-full min-h-full px-3 pt-10 relative scrollable-container chatbot-chat-view scroll-smooth"
          >
            <For each={[...messages()]}>
              {(message, index) => (
                <>
                  {message.type === "userMessage" && (
                    <GuestBubble
                      message={message.message}
                      backgroundColor={props.userMessage?.backgroundColor}
                      textColor={props.userMessage?.textColor}
                      showAvatar={props.userMessage?.showAvatar}
                      avatarSrc={props.userMessage?.avatarSrc}
                    />
                  )}

                  {message.type === "apiMessage" && (
                    <BotBubble
                      message={message.message}
                      backgroundColor={props.botMessage?.backgroundColor}
                      textColor={props.botMessage?.textColor}
                      showAvatar={props.botMessage?.showAvatar}
                      avatarSrc={props.botMessage?.avatarSrc}
                    />
                  )}

                  {message.type === "option" && (
                    <div class="flex flex-wrap  gap-2 mt-5 mb-3">
                      <For each={[...message.message.split(",")]}>
                        {(option) => (
                          <OptionBubble
                            topic_name={option}
                            backgroundColor={props.botMessage?.backgroundColor}
                            textColor={props.botMessage?.textColor}
                            onOptionClick={() => optionSelect(option)}
                          />
                        )}
                      </For>
                    </div>
                  )}

                  {message.type === "userMessage" && loading() && index() === messages().length - 1 && (
                    <LoadingBubble />
                  )}
                  {message.sourceDocuments && message.sourceDocuments.length && (
                    <div style={{ display: "flex", "flex-direction": "row", width: "100%" }}>
                      <For each={[...removeDuplicateURL(message)]}>
                        {(src) => {
                          const URL = isValidURL(src.metadata.source);
                          return (
                            <SourceBubble
                              pageContent={URL ? URL.pathname : src.pageContent}
                              metadata={src.metadata}
                              onSourceClick={() => {
                                if (URL) {
                                  window.open(src.metadata.source, "_blank");
                                } else {
                                  setSourcePopupSrc(src);
                                  setSourcePopupOpen(true);
                                }
                              }}
                            />
                          );
                        }}
                      </For>
                    </div>
                  )}
                </>
              )}
            </For>
            {!userSession() && !sessionLoading() ? (
              <LoginPrompt
                formFields={props?.loginPrompt ?? [{ field_name: "Email", is_required: true }]}
                onSubmit={createUserSession}
              />
            ) : null}
          </div>
          <TextInput
            backgroundColor={props.textInput?.backgroundColor}
            textColor={props.textInput?.textColor}
            placeholder={props.textInput?.placeholder}
            sendButtonColor={props.textInput?.sendButtonColor}
            fontSize={props.fontSize}
            defaultValue={userInput()}
            onSubmit={handleSubmit}
          />
        </div>
        <Badge
          badgeBackgroundColor={props.badgeBackgroundColor}
          poweredByTextColor={props.poweredByTextColor}
          botContainer={botContainer}
          visibility={poweredByVisibility()}
        />
        <BottomSpacer ref={bottomSpacer} />
      </div>
      {sourcePopupOpen() && (
        <Popup isOpen={sourcePopupOpen()} value={sourcePopupSrc()} onClose={() => setSourcePopupOpen(false)} />
      )}
    </>
  );
};

type BottomSpacerProps = {
  ref: HTMLDivElement | undefined;
};
const BottomSpacer = (props: BottomSpacerProps) => {
  return <div ref={props.ref} class="w-full h-32" />;
};
