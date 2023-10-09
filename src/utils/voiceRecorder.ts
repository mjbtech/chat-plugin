import { speechRecognition } from "@/queries/sendMessageQuery";
import { RecordRTCPromisesHandler } from "recordrtc";

const AUDIO_TYPE = "audio";

// @ts-ignore
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create an analyser node to get audio data
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256; // Adjust this value for your needs

// Connect the analyser node to the audio context's destination (speakers)
// analyser.connect(audioContext.destination);

export default class Recorder {
  private recorder: RecordRTCPromisesHandler | null;
  private stream: MediaStream | null;
  public isRecording: boolean;
  public isStopped: boolean;
  public isPaused: boolean;
  public apiHost: string;
  public tenantId: string;
  public isVisualize: boolean = false;
  constructor(apiHost?: string, tenantId?: string) {
    this.recorder = null;
    this.stream = null;
    this.isRecording = false;
    this.isStopped = true;
    this.isPaused = false;
    this.apiHost = apiHost ?? "";
    this.tenantId = tenantId ?? "";
  }

  public pauseRecording = async (): Promise<void> => {
    if (!this.recorder) {
      throw new Error("Cannot pause recording: no recorder");
    }
    await this.recorder.pauseRecording();
    this.isPaused = true;
    this.isRecording = false;
  };

  public resumeRecording = async (): Promise<void> => {
    if (!this.recorder) {
      throw new Error("Cannot resume recording: no recorder");
    }
    await this.recorder.resumeRecording();
    this.isPaused = false;
    this.isRecording = true;
  };

  public startRecording = async (): Promise<void> => {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const microphoneInput = audioContext.createMediaStreamSource(this.stream);
      microphoneInput.connect(analyser);
      this.recorder = new RecordRTCPromisesHandler(this.stream, {
        type: AUDIO_TYPE,
      });

      this.recorder.startRecording();
      this.isRecording = true;
      this.isStopped = false;
      this.isVisualize = true;
    } catch (error: any) {
      this.isRecording = false;
      this.isStopped = true;
      throw new Error(`Error starting recording: ${error.message}`);
    }
  };

  public stopRecording = async (onFinish: (text: string) => void): Promise<void> => {
    if (!this.isRecording || !this.recorder) {
      throw new Error("Cannot stop recording: no recorder");
    }
    try {
      await this.recorder.stopRecording();
      const blob = await this.recorder.getBlob();
      const response = await this.transcribe(blob);
      if (response) {
        onFinish(response);
      }
      this.stream?.getTracks().forEach((track) => {
        track.stop();
      });
      this.recorder = null;
      this.stream = null;
      this.isRecording = false;
      this.isStopped = true;
      this.isPaused = false;
      this.isVisualize = false;
    } catch (error: any) {
      this.isRecording = false;
      this.isStopped = true;
      throw new Error(`Error stopping recording: ${error.message}`);
    }
  };

  private async transcribe(blob: Blob): Promise<string | undefined> {
    const convertedFile = new File([blob], "input.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", convertedFile, "input.wav");
    if (!convertedFile) return;
    const { data: response } = await speechRecognition({
      apiHost: this.apiHost,
      tenantId: this.tenantId,
      body: formData,
    });
    const transcription = response.results.map((result: any) => result.alternatives[0].transcript).join("\n");
    return transcription;
  }

  public visualizeSound = (audioValueCallback: (value: number) => void) => {
    if (!this.isVisualize) return;

    requestAnimationFrame(() => {
      this.visualizeSound(audioValueCallback); // Recursively call the function

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      const audioValue = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

      // Pass the audio value to the callback function
      audioValueCallback(audioValue);

      // const animationElement = document.getElementById("pulse");
      // if (animationElement) {
      //   animationElement.style.animation = `pulse-animation ${audioValue * 0.1}s infinite`;
      // }
    });
  };
}

// export function visualizeSoundFn() {
//   requestAnimationFrame(visualizeSoundFn);
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);
//   analyser.getByteFrequencyData(dataArray);

//   const audioValue = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

//   // Adjust the animation based on the audioValue
//   const animationElement = document.getElementById("pulse");
//   console.log(animationElement, audioValue);
//   if (animationElement) animationElement.style.animation = `pulse-animation ${audioValue * 0.1}s infinite`;
// }
