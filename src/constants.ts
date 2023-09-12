import type { BubbleProps } from "./features/bubble";

export const defaultBotProps: BubbleProps = {
  chatflowid: "",
  tenantId: undefined,
  apiHost: undefined,
  loginPrompt: {
    form_fields: [
      {
        field_name: "Email",
        is_required: true,
      },
    ],
  },
  header: undefined,
  poweredByVisibility: true,
  chatflowConfig: undefined,
  theme: undefined,
};
