import { Show, onMount } from "solid-js";
import { Avatar } from "../avatars/Avatar";
import { Marked, Renderer } from "@ts-stack/markdown";

type Props = {
  message: string;
  showAvatar?: boolean;
  avatarSrc?: string;
  backgroundColor?: string;
  textColor?: string;
};

const defaultBackgroundColor = "#f7f8ff";
const defaultTextColor = "#303235";
const renderer = new Renderer();

renderer.heading = function (text: string, level: number) {
  if (level === 1) {
    return `<h1 class="text-4xl font-bold  my-4">${text}</h1>`;
  } else if (level === 2) {
    return `<h2 class="text-3xl font-semibold my-3">${text}</h2>`;
  } else {
    return `<h${level} class="text-xl font-medium my-2">${text}</h${level}>`;
  }
};

renderer.list = function (body) {
  return `<ul class="list-disc px-4">${body}</ul>`;
};

renderer.listitem = function (text) {
  return `<li class="my-2">${text}</li>`;
};

renderer.table = function (header, body) {
  return `<div class="overflow-x-auto"><table class="w-full table-collapse divide-y"><thead class="text-sm text-left uppercase font-semibold text-grey-darker p-3 bg-gray-200" >${header}</thead><tbody class="align-baseline divide-y" >${body}</tbody></table></div>`;
};

renderer.tablerow = function (content) {
  return `<tr class="group cursor-pointer hover:bg-gray-100" >${content}</tr>`;
};

renderer.tablecell = function (content) {
  return `<td class="text-sm p-3 border-t border-grey-light">${content}</td>`;
};

Marked.setOptions({
  tables: true,
  sanitizer: (text) => {
    console.log(text);
    return text;
  },
  renderer,
});

export const BotBubble = (props: Props) => {
  let botMessageEl: HTMLDivElement | undefined;

  onMount(() => {
    if (botMessageEl) {
      const preprocessedMessage = props.message.replace(/\n{3,}/g, "\n\n");
      botMessageEl.innerHTML = Marked.parse(preprocessedMessage);
    }
  });

  return (
    <div class="flex justify-start items-start host-container" style={{ "margin-right": "50px" }}>
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
      </Show>
      <span
        ref={botMessageEl}
        class="px-4 py-2 ml-2 max-w-full chatbot-host-bubble flex flex-col gap-2"
        data-testid="host-bubble"
        style={{
          "background-color": props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
          "border-radius": "6px",
        }}
      />
    </div>
  );
};
