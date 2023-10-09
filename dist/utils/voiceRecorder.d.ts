export default class Recorder {
    private recorder;
    private stream;
    isRecording: boolean;
    isStopped: boolean;
    isPaused: boolean;
    apiHost: string;
    tenantId: string;
    isVisualize: boolean;
    constructor(apiHost?: string, tenantId?: string);
    pauseRecording: () => Promise<void>;
    resumeRecording: () => Promise<void>;
    startRecording: () => Promise<void>;
    stopRecording: (onFinish: (text: string) => void) => Promise<void>;
    private transcribe;
    visualizeSound: (audioValueCallback: (value: number) => void) => void;
}
//# sourceMappingURL=voiceRecorder.d.ts.map