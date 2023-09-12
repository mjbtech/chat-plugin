type BotProps = {
    chatflowid: string;
    tenantId?: string;
    apiHost?: string;
    loginPrompt: {
        form_fields: {
            field_name: string;
            is_required: boolean;
        }[];
    };
    poweredByVisibility: boolean;
    chatflowConfig?: Record<string, unknown>;
};
export declare const initFull: (props: BotProps & {
    id?: string;
}) => void;
export declare const init: (props: BotProps) => void;
type Chatbot = {
    initFull: typeof initFull;
    init: typeof init;
};
export declare const parseChatbot: () => {
    initFull: (props: BotProps & {
        id?: string;
    }) => void;
    init: (props: BotProps) => void;
};
export declare const injectChatbotInWindow: (bot: Chatbot) => void;
export {};
//# sourceMappingURL=window.d.ts.map