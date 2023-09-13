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
    loginPrompt: {
        form_fields: {
            field_name: string;
            is_required: boolean;
        }[];
    };
    submitButtonBackground?: string;
    submitIcon?: Node;
    iconBackground?: string;
};
export declare const Bot: (props: BotProps & {
    class?: string;
    onMax?: () => void;
    isMax?: boolean;
}) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=Bot.d.ts.map