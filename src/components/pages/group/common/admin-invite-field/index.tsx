import { SelectAsyncInputField } from "@components/form/select-async";
import { axUserSearch } from "@services/auth.service";
import useTranslation from "next-translate/useTranslation";
import React from "react";

interface ManageGroupAdministratorsFieldProps {
  name: string;
  label: string;
  onRemove?;
  mb?;
}

export default function ManageGroupAdministratorsField({
  name,
  label,
  onRemove,
  mb
}: ManageGroupAdministratorsFieldProps) {
  const { t } = useTranslation();

  const onUserQuery = async (q) => {
    const { data } = await axUserSearch(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  const handleEventCallback = async (value, event, setSelected) => {
    switch (event.action) {
      case "remove-value":
        const confirmDelete = confirm(t("group:delete_member"));
        if (confirmDelete && onRemove) {
          const { success } = await onRemove(event?.removedValue);
          if (!success) {
            return;
          }
          setSelected(value);
        }
        break;

      default:
        setSelected(value);
        break;
    }
  };

  return (
    <SelectAsyncInputField
      name={name}
      placeholder={t("group:invite")}
      onQuery={onUserQuery}
      eventCallback={handleEventCallback}
      multiple={true}
      isClearable={false}
      label={label}
      mb={mb}
    />
  );
}
