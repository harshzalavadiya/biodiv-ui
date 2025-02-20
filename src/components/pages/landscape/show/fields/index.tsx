import { Box, Heading, IconButton, useDisclosure } from "@chakra-ui/react";
import HTMLContainer from "@components/@core/html-container";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import EditIcon from "@icons/edit";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import { getInjectableHTML } from "@utils/text";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import LandscapeObservationList from "../common/observation-list";

const FieldEditor = dynamic(() => import("../editor"), { ssr: false });

interface IFieldsProps {
  childs: any[];
  size?;
  ml?;
}

export default function LandscapeFields({ childs = [], size = "lg", ml = 0 }: IFieldsProps) {
  const { isLoggedIn } = useGlobalState();
  const [canEdit, setCanEdit] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn) {
      setCanEdit(hasAccess([Role.Admin]));
    }
  }, [isLoggedIn]);

  return (
    <div>
      {childs.map((child) => {
        const { isOpen, onClose, onToggle } = useDisclosure();
        const [content, setContent] = useState(child.content);

        useEffect(() => {
          setContent(child.content);
        }, [child]);

        return (
          <React.Fragment key={child.id}>
            <Box pb={6} ml={ml} hidden={!content && !canEdit && ml}>
              <Heading mb={3} size={size}>
                {child.header}
                {canEdit && (
                  <IconButton
                    variant="link"
                    colorScheme="blue"
                    aria-label={`Edit ${child.header}`}
                    icon={<EditIcon />}
                    onClick={onToggle}
                  />
                )}
              </Heading>
              {isOpen ? (
                <FieldEditor
                  id={child.pageFieldId}
                  onChange={setContent}
                  onClose={onClose}
                  initialContent={content}
                />
              ) : (
                content && (
                  <HTMLContainer
                    className="article"
                    dangerouslySetInnerHTML={{
                      __html: getInjectableHTML(content)
                    }}
                  />
                )
              )}
              {child.id === SITE_CONFIG?.FLORA?.ID && SITE_CONFIG?.FLORA?.LIST && (
                <LandscapeObservationList
                  title={t("landscape:observation.flora_list")}
                  sGroupList={SITE_CONFIG?.FLORA?.LIST}
                />
              )}
              {child.id === SITE_CONFIG?.FAUNA?.ID && SITE_CONFIG?.FAUNA?.LIST && (
                <LandscapeObservationList
                  title={t("landscape:observation.fauna_list")}
                  sGroupList={SITE_CONFIG?.FAUNA?.LIST}
                />
              )}
            </Box>
            {child.childs.length > 0 && <LandscapeFields childs={child.childs} size="md" ml={4} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
