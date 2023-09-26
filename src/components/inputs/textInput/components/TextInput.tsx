import { ShortTextInput } from "./ShortTextInput";
import { SendButton } from "@/components/SendButton";
import { isMobile } from "@/utils/isMobileSignal";
import { createEffect, createSignal, onMount } from "solid-js";

type Props = {
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  sendButtonColor?: string;
  defaultValue?: string;
  fontSize?: number;
  onSubmit: (value: string) => void;
};

const defaultBackgroundColor = "#ffffff";
const defaultTextColor = "#303235";

export const TextInput = (props: Props) => {
  const [inputValue, setInputValue] = createSignal(props.defaultValue ?? "");
  const [micStart, setMicStart] = createSignal(false);
  const [micVisibility, setMicVisibility] = createSignal(false);

  let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;

  const handleInput = (inputValue: string) => setInputValue(inputValue);

  const checkIfInputIsValid = () => inputValue() !== "" && inputRef?.reportValidity();

  createEffect(() => {
    // @ts-ignore
    if (window?.webkitSpeechRecognition) {
      setMicVisibility(true);
    }
  });

  const submit = () => {
    if (checkIfInputIsValid()) props.onSubmit(inputValue());
    setInputValue("");
  };

  const submitWhenEnter = (e: KeyboardEvent) => {
    // Check if IME composition is in progress
    const isIMEComposition = e.isComposing || e.keyCode === 229;
    if (e.key === "Enter" && !isIMEComposition) submit();
  };

  onMount(() => {
    if (!isMobile() && inputRef) inputRef.focus();
  });

  const onMicStart = () => {
    const grammar =
      "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    // @ts-ignore
    var speechRecognitionList = new (window.SpeechGrammarList ||
      // @ts-ignore
      window.webkitSpeechGrammarList ||
      // @ts-ignore
      window.mozSpeechGrammarList ||
      // @ts-ignore
      window.msSpeechGrammarList)();

    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    recognition.onresult = function (event: any) {
      setInputValue(event.results[0][0].transcript);
    };

    recognition.onaudiostart = function () {
      console.log("Audio Start");
      setMicStart(true);
    };

    recognition.onaudioend = function () {
      console.log("Audio End");
      setMicStart(false);
    };
  };

  return (
    <div
      class={"flex items-center justify-between chatbot-input"}
      data-testid="input"
      style={{
        "border-top": "1px solid #eeeeee",
        position: "absolute",
        left: "20px",
        right: "20px",
        bottom: "40px",
        margin: "auto",
        "z-index": 1000,
        "background-color": props.backgroundColor ?? defaultBackgroundColor,
        color: props.textColor ?? defaultTextColor,
      }}
      onKeyDown={submitWhenEnter}
    >
      <ShortTextInput
        ref={inputRef as HTMLInputElement}
        onInput={handleInput}
        value={inputValue()}
        fontSize={props.fontSize}
        placeholder={props.placeholder ?? "Type your question"}
      />
      {micVisibility() && (
        <span on:click={onMicStart} style={{ cursor: "pointer" }}>
          <svg
            fill={micStart() ? "red" : "rgb(59, 129, 246)"}
            height="23px"
            width="23px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            enable-background="new 0 0 512 512"
          >
            <g>
              <g>
                <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z" />
                <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z" />
              </g>
            </g>
          </svg>
        </span>
      )}

      <SendButton
        sendButtonColor={props.sendButtonColor}
        type="button"
        isDisabled={inputValue() === ""}
        class="my-2 ml-2"
        on:click={submit}
      >
        <span style={{ "font-family": "Poppins, sans-serif" }}>Send</span>
      </SendButton>
    </div>
  );
};
