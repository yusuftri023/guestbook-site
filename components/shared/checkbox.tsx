import { Checkbox } from "@headlessui/react";
import { useState } from "react";

export default function CheckboxButton({
  initialValue = false,
  onChange = () => null,
}: {
  initialValue?: boolean;
  onChange?: () => void;
}) {
  const [enabled, setEnabled] = useState(initialValue);

  return (
    <Checkbox
      checked={enabled}
      onChange={() => {
        setEnabled((prev) => !prev);
        onChange();
      }}
      className="group block size-6 rounded border bg-white data-[checked]:bg-blue-500"
    >
      {/* Checkmark icon */}
      <svg
        className="stroke-white opacity-0 group-data-[checked]:opacity-100"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Checkbox>
  );
}
