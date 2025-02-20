import { Flex, Image, Link, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import JoinUserGroup from "../../common/join-group";
import useGroupListFilter from "../use-group-list";
import IconsList from "./icons-list";

export const UserGroupListTableRows = [
  {
    Header: "Name",
    accessor: "name",
    style: { width: "12rem" },
    Cell: ({ cell, value }) => (
      <LocalLink href={cell.row.original.webAddress}>
        <Link w="full">
          <Flex alignItems="center">
            <Image
              minW="4rem"
              w="4rem"
              h="3rem"
              objectFit="contain"
              loading="lazy"
              src={`${cell.row.original.icon}?w=96`}
              aria-label={`${value} Logo`}
              mr={2}
            />
            <Text lineHeight="1rem">{value}</Text>
          </Flex>
        </Link>
      </LocalLink>
    )
  },
  {
    Header: "Species Groups",
    accessor: "speciesGroupIds",
    style: { width: "24rem" },
    Cell: ({ value }) => {
      const { speciesGroups } = useGroupListFilter();
      return <IconsList items={speciesGroups} type="species" values={value} />;
    }
  },
  {
    Header: "Habitats",
    accessor: "habitatIds",
    style: { width: "24rem" },
    Cell: ({ value }) => {
      const { habitat } = useGroupListFilter();
      return <IconsList items={habitat} type="habitat" values={value} />;
    }
  },
  {
    Header: "Participants",
    accessor: "memberCount"
  },
  {
    Header: "Type",
    accessor: "isParticipatory",
    Cell: ({ value }) => (value ? "Open" : "Closed")
  },
  {
    Header: "Join",
    accessor: "id",
    style: { width: "12rem" },
    Cell: ({ value, cell }) => {
      const { groupJoinedStatus, setGroupJoinedStatus } = useGroupListFilter();
      const { t } = useTranslation();

      const onGroupJoin = (status) =>
        setGroupJoinedStatus({ ...groupJoinedStatus, [value]: status });

      return groupJoinedStatus ? (
        <JoinUserGroup
          currentGroup={cell.row.original}
          isCurrentGroupMember={groupJoinedStatus[value]}
          setIsCurrentGroupMember={onGroupJoin}
          showLeave={true}
          showSignInRequired={true}
        />
      ) : (
        t("common:loading")
      );
    }
  }
];
