type RatingProps = {
    backgroundColor?: string;
    textColor?: string;
    disabled?: boolean;
    onSubmitReview: (payload: {
        feedback: string;
        rating: number;
    }) => void;
    messageIndex: number;
};
export declare const RatingBubble: (props: RatingProps) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=RatingBubble.d.ts.map