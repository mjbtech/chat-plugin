export default class FFmpegUtils {
    private static instance;
    private ffmpeg;
    private constructor();
    static getInstance(): FFmpegUtils;
    load(): Promise<boolean>;
    convertToLinear(content: File): Promise<Blob | null>;
    blobToBase64(blob: Blob): Promise<string>;
}
//# sourceMappingURL=ffmpeg.d.ts.map