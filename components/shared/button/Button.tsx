import { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingCircle } from "../icons";
export default function Button({
  children,
  additionalClassName,
  isLoading = false,
  ...props
}: {
  children?: ReactNode;
  additionalClassName?: string;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={
        "flex min-h-[40px] min-w-[100px] items-center justify-center rounded-xl px-3 py-1.5 " +
        (additionalClassName ? additionalClassName : "")
      }
      {...props}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex min-h-full w-auto items-center justify-center">
          <LoadingCircle />
        </div>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
