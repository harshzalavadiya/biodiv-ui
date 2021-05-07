import { Box, Link, Stack, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config.json";
import styled from "@emotion/styled";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import CrossIcon from "@icons/cross";
import MenuIcon from "@icons/menu";
import { Mq } from "mq-styled-components";
import React from "react";

import JoinUserGroup from "../join-group";
import EditLinkButton from "./edit-link-button";

const Logo = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0;
  min-height: 3.4rem;
  flex-wrap: wrap;

  .right-logo {
    display: contents;
  }

  a {
    display: flex;
    align-items: center;
    line-height: 1.2rem;
  }

  .icon-gov,
  a img {
    height: 3.75rem;
    max-width: 8rem;
    object-fit: contain;
  }

  .menu-toggle {
    display: none;
    padding: 0.5rem;
    font-size: 1.5rem;
  }

  .icon-gov,
  .join-usergroup {
    margin-left: 0.75rem;
  }

  ${Mq.max.sm} {
    width: 100%;

    .menu-toggle {
      display: initial;
    }

    .join-usergroup {
      flex-basis: 100%;
      margin: 0.75rem 0;
      width: 100%;
    }
  }

  ${Mq.min.md + " and (max-width: 768px)"} {
    padding: 0.5rem 0;
  }
`;

export default function PrimaryLogo({ isOpen, onToggle }) {
  const {
    currentGroup: { name, nameLocal, icon }
  } = useGlobalState();

  const { t } = useTranslation();

  return (
    <Logo>
      <LocalLink href="/" prefixGroup={true}>
        <Link>
          <img src={`${icon}?w=128&preserve=true`} alt={name} title={name} />
          <Box ml={2} textAlign="center">
            {nameLocal && <Box mb={1}>{nameLocal}</Box>}
            {name}
          </Box>
        </Link>
      </LocalLink>
      {SITE_CONFIG.SITE?.GOV && (
        <img
          className="icon-gov"
          src={SITE_CONFIG.SITE?.GOV.ICON}
          alt={SITE_CONFIG.SITE?.GOV.NAME}
          title={SITE_CONFIG.SITE?.GOV.NAME}
        />
      )}
      <button className="menu-toggle" onClick={onToggle} aria-label="toggle primary menu">
        {isOpen ? <CrossIcon /> : <MenuIcon />}
      </button>
      <JoinUserGroup />
      <EditLinkButton label={t("GROUP.EDIT.TITLE")} />
    </Logo>
  );
}
