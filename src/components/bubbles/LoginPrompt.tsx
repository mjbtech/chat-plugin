import { createSignal } from "solid-js";

type Props = {
  formFields?: {
    field_name: string;
    is_required: boolean;
  }[];
  submitButtonBackground?: string;
  submitIcon?: Node;
  iconBackground?: string;
  onSubmit: any;
};
export const LoginPrompt = (props: Props) => {
  const [formData, setFormData] = createSignal({});
  const onChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
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
        <div class="overflow-auto rounded-lg py-3 px-4 bg-[#f7f8ff] text-black my-4 max-w-sm">
          <div class="flex space-x-3">
            <div class="flex-1 gap-4">
              <div class="text-inherit text-left">
                <div class="min-w-[16rem]">
                  <div class="flex justify-between mb-4">
                    <h4 class="font-semibold pr-8">Let us know how to contact you</h4>
                  </div>
                  <div class="mb-4">
                    {props?.formFields?.map((field) => (
                      <div class="mb-5">
                        <label class="block text-sm font-medium mb-1">{field.field_name}</label>
                        <div class="flex w-full rounded bg-white">
                          <input
                            class="min-w-0 p-1 flex-auto w-full rounded bg-inherit px-3 py-2 focus:outline-none focus:ring-none sm:text-sm border border-gray-300"
                            type={field.field_name.toLowerCase().indexOf("email") > -1 ? "email" : "text"}
                            name={field.field_name}
                            required={field.is_required}
                            onChange={onChange} // Assuming you have an `onChange` function defined
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div class="flex justify-between items-end">
                    <div></div>

                    <button
                      class="text-sm px-3 py-2 text-white rounded-md"
                      style={{ background: props.submitButtonBackground ?? "rgb(59, 129, 246)" }}
                    >
                      {props.submitIcon ? (
                        props.submitIcon
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={props.iconBackground ?? "#fff"}
                          aria-hidden="true"
                          class="h-4 w-4"
                        >
                          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"></path>
                        </svg>
                      )}
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
