import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import WYSIWYGEditor from "@components/@core/wysiwyg-editor";
import React from "react";
import { useController } from "react-hook-form";

interface IWYSIWYGFieldProps {
  name: string;
  label?: string;
  mt?: number;
  mb?: number;
  hint?: string;
  uploadHandler?;
}

const WYSIWYGField = ({
  name,
  label,
  mb = 4,
  hint,
  uploadHandler,
  ...props
}: IWYSIWYGFieldProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <FormControl isInvalid={fieldState.invalid} mb={mb} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <WYSIWYGEditor
        name={name}
        value={field.value}
        onEditorChange={field.onChange}
        placeholder={label}
        onBlur={field.onBlur}
        uploadHandler={uploadHandler}
      >
        {label}
      </WYSIWYGEditor>

      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default WYSIWYGField;
