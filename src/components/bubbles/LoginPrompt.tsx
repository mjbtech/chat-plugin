import { createEffect, createSignal } from "solid-js";
import { ShortTextInput } from "../inputs/textInput/components/ShortTextInput";

type Props = {
  formFields?: {
    field_name: string;
    is_required: boolean;
  }[];
  backgroundColor?: string;
  textColor?: string;

  submitButtonBackground?: string;
  submitButtonTextColor?: string;
  submitIcon?: Node;
  iconBackground?: string;
  onSubmit: any;
};
export const LoginPrompt = (props: Props) => {
  const [formData, setFormData] = createSignal({});
  let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;
  createEffect(() => {
    inputRef?.focus();
  }, []);
  const onChange = (name: any, value: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.onSubmit(formData()); // Assuming you have defined the `formData` function elsewhere
        }}
      >
        <div
          class="overflow-auto rounded-lg py-3 px-4  my-4 max-w-sm ml-2"
          style={{
            "background-color": props.backgroundColor ?? "#f7f8ff",
            color: props.textColor ?? "#000",
          }}
        >
          <div class="flex space-x-3">
            <div class="flex-1 gap-4">
              <div class="text-inherit text-left">
                <div class="min-w-[16rem]">
                  <div class="flex justify-between mb-4">
                    <h4 class="pr-8">
                      To offer you top-notch support and stay connected, may we kindly request your email address?
                    </h4>
                  </div>
                  <div class="mb-4">
                    {props?.formFields?.map((field, i) => (
                      <div class="mb-5">
                        <label class="block text-sm font-medium mb-1">{field.field_name}</label>
                        <div class="flex w-full rounded bg-white">
                          {i == 0 ? (
                            <ShortTextInput
                              ref={inputRef as HTMLInputElement}
                              onInput={(value) => onChange(field.field_name, value)}
                              // value={formData()?}
                              fontSize={16}
                              placeholder={`Type your ${field.field_name.toLowerCase()}`}
                            />
                          ) : (
                            <ShortTextInput
                              ref={undefined}
                              onInput={(value) => onChange(field.field_name, value)}
                              // value={formData()?}
                              fontSize={16}
                              placeholder={`Type your ${field.field_name.toLowerCase()}`}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div class="flex justify-center items-end">
                    <button
                      class="text-sm px-3 py-2 rounded-md font-bold"
                      style={{
                        background: props.submitButtonBackground ?? "rgb(59, 129, 246)",
                        color: props.submitButtonTextColor ?? "#fff",
                      }}
                    >
                      Let's Chat! 🚀
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
