import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { ProductFormValues } from "../../../lib/validators";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import StarterKit from "@tiptap/starter-kit";
import { ReactNode } from "react";

interface Props {
  setValue: UseFormSetValue<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  initialContent?: JSONContent;
}

export const Editor = ({ setValue, errors, initialContent }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();

      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px] prose prose-sm sm:prose-base",
      },
    },
  });

  return (
    <div className="space-y-3">
      <EditorContent editor={editor} />

      {errors.description && (
        <p className="text-red-500 text-sm mt-1">
          {(errors.description.message as ReactNode) ||
            "Debe ingresar una descripción"}
        </p>
      )}
    </div>
  );
};
