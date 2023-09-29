import { Show, createSignal, onCleanup } from "solid-js";
import { Transition } from "solid-transition-group";

type RatingProps = {
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  onSubmitReview: (payload: { feedback: string; rating: number }) => void;
  messageIndex: number;
};

export const RatingBubble = (props: RatingProps) => {
  const [selectedRating, setSelectedRating] = createSignal(0);
  const [openFeedback, setOpenFeedback] = createSignal(false);
  const [postedFeedback, setPostedFeedback] = createSignal<number[]>([]);
  const [feedback, setFeedback] = createSignal<string>("");
  const [selectedIndex, setSelectedIndex] = createSignal<number>(-1);

  const handleRatingClick = async (rating: number, index: number) => {
    setSelectedRating(rating);
    setSelectedIndex(index);
    setOpenFeedback(true);
  };

  const postReview = () => {
    setPostedFeedback([...postedFeedback(), selectedIndex()]);
    setOpenFeedback(false);
    setSelectedIndex(-1);
    props.onSubmitReview({ rating: selectedRating(), feedback: feedback() });
    setFeedback("");
  };

  onCleanup(() => {
    setSelectedRating(0);
    setOpenFeedback(false);
  });

  const onClose = () => {
    setPostedFeedback([...postedFeedback(), selectedIndex()]);
    props.onSubmitReview({ rating: selectedRating(), feedback: "" });
    setFeedback("");
    setSelectedIndex(-1);
    setOpenFeedback(false);
  };

  return (
    <div class="px-2 ml-2 mb-4 mt-1 flex items-center gap-2" style={{ "margin-right": "50px" }}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <svg
          height="22px"
          width="22px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 53.867 53.867"
          onClick={() => {
            if (postedFeedback().includes(props.messageIndex)) return;
            handleRatingClick(rating, props.messageIndex);
          }}
          class="cursor-pointer transition-colors duration-300 ease-in-out"
          //   onMouseEnter={() => handleRatingClick(rating)}
          style={
            selectedRating() >= rating
              ? `fill:${props.backgroundColor ?? "#EFCE4A"};`
              : "fill:#FFF;stroke:#9095a0;stroke-width:2;"
          }
        >
          <polygon
            style={
              selectedRating() >= rating
                ? `fill:${props.backgroundColor};}` ?? "fill:#EFCE4A"
                : "fill:#FFF;stroke:#9095a0;stroke-width:2;"
            }
            points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182"
          />
        </svg>
      ))}

      <Transition
        onEnter={(el, done) => {
          const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 200,
          });
          a.finished.then(done);
        }}
        onExit={(el, done) => {
          const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 200,
          });
          a.finished.then(done);
        }}
      >
        {openFeedback() ? (
          <div class="fixed inset-0 flex items-center justify-center z-[99999] bg-[rgba(0,0,0,0.4)]">
            <div class="bg-white p-4 rounded shadow-md flex flex-col gap-3 w-3/4">
              <h2 class="text-xl font-semibold mb-2">Share your feedback</h2>
              <textarea
                class="h-28 text-sm p-1 border border-gray-300 rounded-lg"
                placeholder="We're eager to hear from you – start typing!"
                onChange={(e) => setFeedback(e.target.value)}
                value={feedback()}
              ></textarea>
              <div class="text-right">
                <button
                  class={`text-sm mt-4 px-4 py-1 mr-2 rounded`}
                  style={{ color: props.backgroundColor, border: `1px solid ${props.backgroundColor}` }}
                  on:click={onClose}
                >
                  Close
                </button>
                <button
                  class={`text-sm mt-4 px-4 py-1 rounded`}
                  style={{ "background-color": props.backgroundColor, color: props.textColor }}
                  on:click={postReview}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Transition>
    </div>
  );
};
