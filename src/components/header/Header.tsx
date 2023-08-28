import { JSX, Show, onMount } from "solid-js";
import { Avatar } from "../avatars/Avatar";
import { Marked } from "@ts-stack/markdown";

type Props = {
  title?: string;
  subTitle?: string;
  backgroundColor?: string;
  textColor?: string;
  avatar?: string;
  avatarStyle?: any;
  gotoTopic?: any;
};

const defaultBackgroundColor = "rgb(59, 129, 246)";
const defaultTextColor = "#fff";
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
const defaultTitle = "AI Assistant";
const defaultSubTitle = "Ask me anything..!";

Marked.setOptions({ isNoP: true });

export const Header = (props: Props) => {
  return (
    <div
      class="w-full h-16 py-3 fixed flex px-6 items-center z-[999]"
      style={{
        "background-color": props.backgroundColor ?? defaultBackgroundColor,
        color: props.textColor ?? defaultTextColor,
      }}
    >
      <div class="pr-3">
        <img src={props.avatar ?? defaultAvatar} style={props.avatarStyle ?? { width: "36px" }} />
      </div>
      <div class="flex-1">
        <div class="font-bold" style={{ "line-height": 1.5 }}>
          {props.title ?? defaultTitle}
        </div>
        <div class="text-[13px]" style={{ "line-height": 1 }}>
          {props.subTitle ?? defaultSubTitle}
        </div>
      </div>
      <div class="cursor-pointer" onclick={props.gotoTopic}>
        View Menu
      </div>
    </div>
  );
};
