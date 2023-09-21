type Props = {
  topic_name: string;
  onOptionClick?: () => void;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};

const defaultBackgroundColor = "rgb(59, 129, 246)";
const defaultTextColor = "#fff";

export const OptionBubble = (props: Props) => (
  <>
    <div
      class="flex justify-start mb-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75"
      onClick={() => props.onOptionClick?.()}
    >
      <span
        class="px-2 py-1 ml-1 whitespace-pre-wrap max-w-full hover:bg-blue-200 hover:bg-opacity-25"
        data-testid="host-bubble"
        style={{
          "font-size": "14px",
          "border-radius": "15px",
          border: "1px solid",
          "border-color": props.backgroundColor ?? defaultBackgroundColor,
          color: props.backgroundColor ?? defaultBackgroundColor,
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
