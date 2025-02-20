import { DragHandleIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import DeleteIcon from "@icons/delete";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { SortableElement } from "react-sortable-hoc";

const BooleanIcon = ({ isChecked }) => (
  <Box as="td" w="8rem">
    {isChecked ? <CheckIcon color="green.500" /> : <CrossIcon color="red.500" />}
  </Box>
);

const CustomFieldRow = SortableElement(({ itemDetails, onDelete }) => {
  const { t } = useTranslation();
  const {
    customFields: { dataType, fieldType, name },
    allowedParticipation,
    isMandatory
  } = itemDetails;

  return (
    <tr>
      <Box as="td" w="16rem">
        <DragHandleIcon cursor="move" /> {name}
      </Box>
      <td>{dataType}</td>
      <td>{fieldType}</td>
      <BooleanIcon isChecked={isMandatory} />
      <BooleanIcon isChecked={allowedParticipation} />
      <td>
        <Button
          onClick={onDelete}
          variant="link"
          colorScheme="red"
          leftIcon={<DeleteIcon />}
          ml={2}
        >
          {t("common:delete")}
        </Button>
      </td>
    </tr>
  );
});

export default CustomFieldRow;
