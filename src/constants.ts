import type { BubbleProps } from "./features/bubble";

export const defaultBotProps: BubbleProps = {
  chatflowid: "",
  tenantId: undefined,
  apiHost: undefined,

  header: undefined,
  poweredByVisibility: true,
  chatflowConfig: undefined,
  theme: {
    loginPrompt: [
      {
        field_name: "Email",
        is_required: true,
      },
    ],
    poweredByVisibility: true,
  },
};
