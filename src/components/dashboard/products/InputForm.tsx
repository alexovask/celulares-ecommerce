import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ProductFormValues } from "../../../lib/validators";

interface Props {
  className?: string;

  label: string;
  name: keyof ProductFormValues;
  type: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const InputForm = ({
  className,
  label,
  name,
  type,
  placeholder,
  required,
  register,
  errors,
}: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label
          htmlFor={name}
          className="text-sm font-bold tracking-tight capitalize text-slate-900"
        >
          {label}:
        </label>
        {required && (
          <span
            className={`${required && "text-red-500 text-sm mr-3"}  font-bold self-end`}
          >
            *
          </span>
        )}
      </div>
      <div
        className={`border border-gray-300 rounded-md overflow-hidden gap-5 items-center
         ${errors[name] ? "border-red-500" : ""}`}
      >
        <input
          className={`py-1.5 text-sm px-3 font-medium tracking-tighter w-full text-slate-600  outline-none focus:outline-none ${className}`}
          type={type}
          placeholder={placeholder}
          id={name}
          autoComplete="off"
          {...register(name)}
        />
      </div>
    </div>
  );
};
