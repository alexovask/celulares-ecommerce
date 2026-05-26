import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductFormValues, productSchema } from "../../../lib/validators";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import { SectionFormProduct } from "./SectionFormProduct";
import { InputForm } from "./InputForm";
import { FeaturesInput } from "./FeaturesInput";
import { useEffect } from "react";
import { generateSlug } from "../../../helpers";
import { VariantsInput } from "./VariantsInput";
import { UploaderImages } from "./UploaderImages";
import { Editor } from "./Editor";

interface Props {
  titleForm: string;
}

export const FormProduct = ({ titleForm }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      slug: "",
      features: [],
      variants: [],
      image: [],
    },
  });

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  const watchName = watch("name");

  useEffect(() => {
    if (!watchName) {
      const genetaredSlug = generateSlug(watchName);
      setValue("slug", genetaredSlug, { shouldValidate: true });
    }
  }, [watchName, setValue]);

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 transition-all group-hover:scale-105"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack
              size={20}
              className="transition-all group-hover:scale-125"
            />
          </button>
          <h2 className="font-bold tracking-tight text-2xl capitalize">
            {titleForm}
          </h2>
        </div>
      </div>
      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-max flex-1"
        onSubmit={onSubmit}
      >
        <SectionFormProduct
          titleSection="Información general del producto"
          className="lg:col-span-2 lg:row-span-2"
        >
          <InputForm
            type="text"
            placeholder="Ejemplo iphone 17 pro"
            label="nombre"
            name="name"
            register={register}
            errors={errors}
            required
          />
          <FeaturesInput control={control} errors={errors} />
        </SectionFormProduct>

        <SectionFormProduct>
          <InputForm
            type="text"
            label="Slug"
            name="slug"
            placeholder="iphone-17-pro"
            register={register}
            errors={errors}
          ></InputForm>
          <InputForm
            type="text"
            label="Marca"
            name="brand"
            placeholder="Apple"
            register={register}
            errors={errors}
            required
          ></InputForm>
        </SectionFormProduct>
        <SectionFormProduct
          titleSection="Variantes del producto"
          className="lg:col-span-2 h-fit"
        >
          <VariantsInput
            control={control}
            errors={errors}
            register={register}
          />
        </SectionFormProduct>

        <SectionFormProduct titleSection="Imagenes del producto">
          <UploaderImages setValue={setValue} watch={watch} errors={errors} />
        </SectionFormProduct>
        <SectionFormProduct
          titleSection="Descripción del producto"
          className="col-span-full"
        >
          <Editor setValue={setValue} errors={errors} />
        </SectionFormProduct>

        <div className="flex gap-3 absolute top-0 right-0">
          <button
            className="btn-secondary-outline"
            onClick={() => navigate(-1)}
          >
            conselar
          </button>
          <button className="btn-primary">Guardar Producto</button>
        </div>
      </form>
    </div>
  );
};
