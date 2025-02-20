import { Link, MenuItem, MenuList } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SubMenu({ rows, onClose, prefix = "" }) {
  const { t } = useTranslation();
  const { isCurrentGroupMember, isLoggedIn } = useGlobalState();

  return (
    <MenuList>
      {rows.map((item) => {
        const label = item.name && t(prefix + item.name);

        // explicit false check is necessary to avoid button flickr
        return (
          <MenuItem key={item.name}>
            {isLoggedIn && item.memberOnly && isCurrentGroupMember === false ? (
              <Link w="full" onClick={() => notification(t("header:member_only"))}>
                {label}
              </Link>
            ) : (
              <LocalLink href={item.to} params={item.params} prefixGroup={true}>
                <Link w="full" onClick={onClose}>
                  {label}
                </Link>
              </LocalLink>
            )}
          </MenuItem>
        );
      })}
    </MenuList>
  );
}
