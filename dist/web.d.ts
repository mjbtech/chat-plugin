declare const chatbot: {
    initFull: (props: {
        chatflowid: string;
        tenantId?: string | undefined;
        apiHost?: string | undefined;
        loginPrompt: {
            form_fields: {
                field_name: string;
                is_required: boolean;
            }[];
        };
        poweredByVisibility: boolean;
        chatflowConfig?: Record<string, unknown> | undefined;
    } & {
        id?: string | undefined;
    }) => void;
    init: (props: {
        chatflowid: string;
        tenantId?: string | undefined;
        apiHost?: string | undefined;
        loginPrompt: {
            form_fields: {
                field_name: string;
                is_required: boolean;
            }[];
        };
        poweredByVisibility: boolean;
        chatflowConfig?: Record<string, unknown> | undefined;
    }) => void;
};
export default chatbot;
//# sourceMappingURL=web.d.ts.map