import { Avatar, AvatarGroup, Box, Button, Stack, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import Flash from "@components/@core/flash";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import LockIcon from "@icons/lock";
import UnlockIcon from "@icons/unlock";
import { AllRecoSugguestions, RecoIbp } from "@interfaces/observation";
import {
  axAgreeRecoVote,
  axRemoveRecoVote,
  axUnlockRecoVote,
  axValidateRecoVote
} from "@services/observation.service";
import { waitForAuth } from "@utils/auth";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

enum RecoAction {
  Agree,
  Remove,
  Validate,
  Unlock
}

interface IRecoSuggestionProps {
  observationId;
  recoIbp: RecoIbp | undefined;
  allRecoVotes: AllRecoSugguestions[] | undefined;
  isLocked?;
  recoUpdated;
  permission?;
  permissionOverride?: any;
}

export default function RecoSuggestion({
  observationId,
  recoIbp,
  allRecoVotes,
  isLocked,
  recoUpdated,
  permission,
  permissionOverride
}: IRecoSuggestionProps) {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useGlobalState();

  const recoVoteOperation = async (func, reco: AllRecoSugguestions) => {
    await waitForAuth();
    const { success, data } = await func(observationId, {
      commonName: reco.commonName,
      scientificName: reco.scientificName,
      taxonId: reco.taxonId
    });
    if (success) {
      recoUpdated(data);
    }
  };

  const recoVoteAction = (reco, action) => {
    switch (action) {
      case RecoAction.Agree:
        recoVoteOperation(axAgreeRecoVote, reco);
        break;
      case RecoAction.Remove:
        recoVoteOperation(axRemoveRecoVote, reco);
        break;
      case RecoAction.Validate:
        recoVoteOperation(axValidateRecoVote, reco);
        break;
      case RecoAction.Unlock:
        recoVoteOperation(axUnlockRecoVote, reco);
        break;
      default:
        break;
    }
  };

  return allRecoVotes ? (
    <>
      {allRecoVotes.map((reco) => {
        const recoUserIds = reco.userList?.map((u) => u.id);
        const canAccept = recoUserIds?.includes(user?.id || -1);
        const canValidate = permission?.includes(reco.taxonId) || permissionOverride;
        return (
          <Flash value={reco} key={reco.taxonId}>
            <Stack
              direction={{ base: "column", md: "row" }}
              alignItems={{ md: "center" }}
              borderBottom="1px"
              borderColor="gray.300"
              px={4}
              py={2}
            >
              <Stack flexGrow={1} isInline={true} justifyContent="space-between">
                <Box minH="3rem">
                  {reco.speciesId ? (
                    <BlueLink
                      className="elipsis"
                      href={`/species/show/${reco.speciesId}`}
                      title={reco.scientificName}
                    >
                      {reco.scientificName}
                    </BlueLink>
                  ) : (
                    <Text className="elipsis">{reco.scientificName}</Text>
                  )}
                  <Text className="elipsis" color="gray.700" title={reco.commonName}>
                    {reco.commonName}
                  </Text>
                </Box>
                <AvatarGroup size="sm" max={2}>
                  {reco.userList?.map((u) => (
                    <Avatar
                      key={u.id}
                      name={u.name}
                      src={getUserImage(u.profilePic, u.name)}
                      title={u.name}
                    />
                  ))}
                </AvatarGroup>
              </Stack>
              <Stack isInline={true} minW="210px" flexShrink={0} className="reco-actions">
                {!isLocked && (
                  <Button
                    variant="outline"
                    size="sm"
                    minW="100px"
                    colorScheme={canAccept ? "red" : "green"}
                    leftIcon={canAccept ? <CrossIcon /> : <CheckIcon />}
                    onClick={() =>
                      recoVoteAction(reco, canAccept ? RecoAction.Remove : RecoAction.Agree)
                    }
                  >
                    {t(canAccept ? "observation:id.remove" : "observation:id.agree")}
                  </Button>
                )}

                {(!isLocked || (isLocked && recoIbp?.taxonId === reco.taxonId)) &&
                  canValidate &&
                  isLoggedIn && (
                    <Button
                      minW="100px"
                      size="sm"
                      variant="outline"
                      colorScheme={isLocked ? "blue" : "red"}
                      ml={2}
                      leftIcon={isLocked ? <UnlockIcon /> : <LockIcon />}
                      onClick={() =>
                        recoVoteAction(reco, isLocked ? RecoAction.Unlock : RecoAction.Validate)
                      }
                    >
                      {t(isLocked ? "observation:id.unlock" : "observation:id.validate")}
                    </Button>
                  )}
              </Stack>
            </Stack>
          </Flash>
        );
      })}
    </>
  ) : null;
}
