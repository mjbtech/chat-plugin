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
  isMax?: boolean;
  onMax?: () => void;
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
      <div style={{ "margin-left": "10px", cursor: "pointer" }} class="hidden sm:block" on:click={props.onMax}>
        {props.isMax ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            style="width: 1.5em; height: 1.5em;vertical-align: middle;fill: currentColor;overflow: hidden;rotate: 90deg;"
          >
            <path d="m4 18v2h6.586l-8.586 8.582 1.414 1.418 8.586-8.586v6.586h2v-10z" />
            <path d="m30 3.416-1.408-1.416-8.592 8.586v-6.586h-2v10h10v-2h-6.586z" />
            <path d="m0 0h32v32h-32z" fill="none" transform="matrix(-1 0 0 -1 32 32)" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="svg-icon"
            style="width: 1.5em; height: 1.5em;vertical-align: middle;fill: currentColor;overflow: hidden;rotate: 90deg;"
            viewBox="0 0 1024 1024"
            version="1.1"
          >
            <path d="M597.34016 554.33216q17.67424 0 30.33088 12.67712l268.32896 268.32896 0-195.66592q0-17.67424 12.4928-30.16704t30.16704-12.4928 30.16704 12.4928 12.4928 30.16704l0 298.65984q0 17.67424-12.67712 30.33088t-30.33088 12.67712l-298.65984 0q-17.67424 0-30.16704-12.4928t-12.4928-30.16704 12.4928-30.16704 30.16704-12.4928l195.66592 0-268.32896-268.32896q-12.32896-13.0048-12.32896-30.33088 0-17.67424 12.4928-30.33088t30.16704-12.67712zM85.34016 42.65984l298.65984 0q17.67424 0 30.16704 12.4928t12.4928 30.16704-12.4928 30.16704-30.16704 12.4928l-195.66592 0 268.32896 268.00128q12.67712 12.67712 12.67712 30.33088t-12.67712 30.16704-30.33088 12.4928q-16.9984 0-30.33088-12.32896l-268.00128-268.32896 0 195.66592q0 17.67424-12.4928 30.16704t-30.16704 12.4928-30.16704-12.4928-12.4928-30.16704l0-298.65984q0-17.67424 12.4928-30.16704t30.16704-12.4928z" />
          </svg>
        )}
      </div>
    </div>
  );
};
