import { BotMessageTheme, TextInputTheme, UserMessageTheme } from "@/features/bubble/types";
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
    fontSize?: number;
    header?: {
        title?: string;
        subTitle?: string;
        backgroundColor?: string;
        textColor?: string;
        avatar?: string;
        avatarStyle?: any;
    };
};
export declare const Bot: (props: BotProps & {
    class?: string;
}) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=Bot.d.ts.map