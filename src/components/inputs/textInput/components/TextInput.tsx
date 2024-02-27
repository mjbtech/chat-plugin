import { SendButton } from "@/components/SendButton";
import { isMobile } from "@/utils/isMobileSignal";
import Recorder from "@/utils/voiceRecorder";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { ShortTextInput } from "./ShortTextInput";

type Props = {
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  sendButtonColor?: string;
  defaultValue?: string;
  fontSize?: number;
  onSubmit: (value: string) => void;
  apiHost?: string;
  tenantId?: string;
  buttonTheme: {
    backgroundColor?: string;
    textColor?: string;
  };
  preSuggestionQuestions?: string[];
  onOptionClick?: any;
};

const defaultBackgroundColor = "#ffffff";
const defaultTextColor = "#303235";

export const TextInput = (props: Props) => {
  const recorder = new Recorder(props.apiHost, props.tenantId);
  const [inputValue, setInputValue] = createSignal(props.defaultValue ?? "");
  const [micStart, setMicStart] = createSignal(false);
  const [micVisibility, setMicVisibility] = createSignal(false);
  const [showModal, setShowModal] = createSignal(false);
  const [transcribe, setTranscribe] = createSignal(false);

  // const pulseElementRef = createRef();

  const grammar =
    "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
  // @ts-ignore
  const recognition = new window.webkitSpeechRecognition();

  // @ts-ignore
  if (window?.webkitSpeechGrammarList) {
    // @ts-ignore
    var speechRecognitionList = new window.webkitSpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
  }

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

  const onMicStart = async () => {
    try {
      // if (!micStart()) {
      setMicStart(true);
      await recorder.startRecording();
      setTimeout(() => setShowModal(true), 500);
      // } else {
      // setMicStart(false);
      // setTranscribe(true);
      // recorder.stopRecording((response) => {
      //   setTranscribe(false);
      //   setShowModal(false);
      //   setInputValue(response);
      // });
      // }
    } catch (error) {
      setTranscribe(false);
      setShowModal(false);
      alert("Please enable microphone recording");
    } finally {
      setTranscribe(false);
      setShowModal(false);
    }
    // if (micStart()) {
    //   recognition.stop();
    //   setMicStart(false);
    // } else {
    //   recognition.start();
    // }
    // // @ts-ignore
    // recognition.continuous = false;
    // recognition.lang = "en-US";
    // recognition.interimResults = false;
    // recognition.maxAlternatives = 1;
    // recognition.onresult = function (event: any) {
    //   setInputValue(event.results[0][0].transcript);
    // };
    // recognition.onaudiostart = function () {
    //   setMicStart(true);
    // };
    // recognition.onaudioend = function () {
    //   console.log("Audio End");
    //   setMicStart(false);
    // };
    // recognition.onspeechstart = function () {
    //   console.log("Speech Start");
    // };
    // recognition.onspeechend = function () {
    //   console.log("Speech End");
    // };
  };

  const stopRecording = () => {
    setMicStart(false);
    setTranscribe(true);
    recorder.stopRecording((response) => {
      setTranscribe(false);
      setShowModal(false);
      setInputValue(response);
    });
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
        <>
          <span on:click={onMicStart} style={{ cursor: "pointer" }}>
            <svg
              fill={micStart() ? "red" : props.backgroundColor}
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

          {/* Modal */}
          {showModal() && (
            <div class="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.4)" }}>
              <div class="bg-white p-6 rounded-lg shadow-lg">
                {/* Microphone icon with sound wave style */}
                <div class="w-52 h-52 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                  <div class="rounded-full shadow-md pulse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={props.backgroundColor}
                      height="120px"
                      width="120px"
                      version="1.1"
                      viewBox="0 0 512 512"
                      enable-background="new 0 0 512 512"
                    >
                      <g>
                        <path d="m256,11c-81,0-147,65.9-147,147v100.3c0,74.1 55.1,135.6 126.5,145.5v56.4h-43.4c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h127.7c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-43.4v-56.4c71.4-10 126.5-71.4 126.5-145.5v-100.3c0.1-81.1-65.9-147-146.9-147zm0,353.4c-42.7,0-79.6-25.3-96.4-61.8h45.1c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-54.8c0-1.2-0.1-33.3-0.1-33.3h54.8c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-54.8c0,0 0-32.1 0.1-33.3h54.8c11.3,0 20.4-9.1 20.4-20.4s-9.1-20.4-20.4-20.4h-45.1c16.8-36.4 53.7-61.8 96.4-61.8 42.7,0 79.6,25.3 96.4,61.8h-45.1c-11.3,0-20.4,9.1-20.4,20.4s9.1,20.4 20.4,20.4h54.8c0,1.2 0.1,33.3 0.1,33.3h-54.8c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h54.8c0,0 0,32.1-0.1,33.3h-54.8c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h45.1c-16.8,36.5-53.7,61.8-96.4,61.8z" />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Stop Recording Button */}
                {transcribe() ? (
                  <div class="flex items-center justify-center">
                    <button
                      type="button"
                      class={`inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md hover:opacity-25 transition ease-in-out duration-150 cursor-not-allowed`}
                      style={{ background: props.buttonTheme.backgroundColor, color: props.buttonTheme.textColor }}
                    >
                      <svg
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </button>
                  </div>
                ) : (
                  <button
                    class="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 active:bg-red-700 w-full"
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </button>
                )}
              </div>
            </div>
          )}
        </>
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
