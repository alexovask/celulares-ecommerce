import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  useWatch,
} from "react-hook-form";

import { ProductFormValues } from "../../../lib/validators";
import { IoIosAddCircleOutline, IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";

interface Props {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
}

export const headersVariants = ["Stock", "Precio", "Capacidad", "Color", ""];

export const VariantsInput = ({ control, errors, register }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const [colorActive, setColorActive] = useState<boolean[]>([]);

  const removeVariant = (index: number) => {
    remove(index);
  };

  const toggleColorActive = (index: number) => {
    setColorActive((prev) =>
      prev.map((item, i) => (i === index ? !item : false)),
    );
  };

  //   usar usewhats uns asola vez para observar todos los valores del color y del colorName

  const colorValues = useWatch({
    control,
    name: fields.map((_, index) => `variants.${index}.color` as const),
  });
  const colorName = useWatch({
    control,
    name: fields.map((_, index) => `variants.${index}.colorName` as const),
  });

  const getFirsrError = (
    variantErrors: FieldErrors<ProductFormValues["variants"][number]>,
  ) => {
    if (variantErrors) {
      const keys = Object.keys(variantErrors) as (keyof typeof variantErrors)[];
      if (keys.length > 0) {
        return variantErrors[keys[0]]?.message;
      }
    }
  };

  useEffect(() => {
    setColorActive((prev) => fields.map((_, index) => prev[index] || false));
  }, [fields]);

  const addVariant = () => {
    append({ stock: 0, price: 0, storage: 0, color: "", colorName: "" });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-4 border-b border-slate-200 pb-6">
        <div className="grid grid-cols-5 gap-4 justify-start">
          {headersVariants.map((header, index) => (
            <p key={index} className="text-xs font-semibold text-slate-800">
              {header}
            </p>
          ))}
        </div>

        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="grid grid-cols-5 gap-4 justify-start">
              <input
                type="number"
                placeholder="Stock"
                {...register(`variants.${index}.stock`, {
                  valueAsNumber: true,
                })}
                className="border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none appearance-none"
              />

              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                {...register(`variants.${index}.price`, {
                  valueAsNumber: true,
                })}
                className="border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none appearance-none"
              />

              <input
                type="text"
                placeholder="64 GB"
                {...register(`variants.${index}.storage`)}
                className="border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none appearance-none"
              />

              <div className="flex relative">
                {colorActive[index] && (
                  <div className="absolute bg-stone-100 rounded-md bottom-8 left-[40px] p-1 w-[100px] h-fit space-y-2">
                    <input
                      type="color"
                      {...register(`variants.${index}.color`)}
                      className="rounded-md px-3 p-1.5 w-full"
                    />

                    <input
                      type="text"
                      placeholder="Azul Marino"
                      {...register(`variants.${index}.colorName`)}
                      className="rounded-md px-3 p-1.5 w-full text-xs focus:outline-none font-semibold placeholder:font-normal"
                    />
                  </div>
                )}

                <button
                  type="button"
                  className="border w-full h-8 cursor-pointer rounded text-xs font-medium flex items-center justify-center"
                  onClick={() => toggleColorActive(index)}
                >
                  {colorValues[index] && colorName[index] ? (
                    <span
                      className="inline-block w-4 h-4 rounded-full bg-block"
                      style={{
                        backgroundColor: colorValues[index],
                      }}
                    />
                  ) : (
                    "Añadir Color"
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-1"
                >
                  <IoIosClose size={20} />
                </button>
              </div>
            </div>
            {errors.variants && errors.variants[index] && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {getFirsrError(errors.variants[index])}
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addVariant}
        className="px-4 py-2 text-slate-800 rounded-md text-sm font-semibold tracking-tight flex items-center gap-1 self-center hover:bg-slate-100 "
      >
        <IoIosAddCircleOutline size={20} />
        Añadir Variante
      </button>
      {fields.length === 0 && errors.variants && (
        <p className="text-red-500 text-xs mt-1 font-medium">
          Debes añadir al menos una variante para el producto
        </p>
      )}
    </div>
  );
};
