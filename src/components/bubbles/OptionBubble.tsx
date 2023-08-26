type Props = {
  topic_name: string;
  onOptionClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
};
export const OptionBubble = (props: Props) => (
  <>
    <div
      class="flex justify-start mb-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75"
      onClick={() => props.onOptionClick?.()}
    >
      <span
        class="px-2 py-1 ml-1 whitespace-pre-wrap max-w-full chatbot-host-bubble"
        data-testid="host-bubble"
        style={{
          "font-size": "14px",
          "border-radius": "15px",
          "border-color": props.backgroundColor,
          color: props.textColor,
          cursor: "pointer",
          "text-overflow": "ellipsis",
          overflow: "hidden",
          "white-space": "nowrap",
        }}
      >
        {props.topic_name}
      </span>
    </div>
  </>
);
