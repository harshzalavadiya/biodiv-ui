import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import HTMLContainer from "@components/@core/html-container";
import Tooltip from "@components/@core/tooltip";
import { ResponsiveInfo } from "@components/pages/observation/show/info/responsive-info";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { SpeciesGroup } from "@interfaces/observation";
import { DATE_ACCURACY } from "@static/constants";
import { formatDateReadableFromUTC } from "@utils/date";
import { covertToSentenceCase, getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

interface IInfoProps {
  dataTable;
  speciesGroups: SpeciesGroup[];
}

export default function Info({ dataTable: dt, speciesGroups }: IInfoProps) {
  const { t } = useTranslation();

  return (
    <Box p={4} mb={4} className="white-box">
      <SimpleGrid columns={[1, 1, 5, 5]} spacing={2}>
        <ResponsiveInfo title="form:name">
          <i>{dt?.title || t("common:unknown")}</i>
        </ResponsiveInfo>

        <ResponsiveInfo title="form:species_groups">
          <SpeciesGroupBox
            id={parseInt(dt?.taxonomicCoverageGroupIds)}
            canEdit={false}
            speciesGroups={speciesGroups}
            observationId={dt?.id}
          />
        </ResponsiveInfo>

        <ResponsiveInfo title="form:place">{dt?.geographicalCoveragePlaceName}</ResponsiveInfo>

        <ResponsiveInfo title="common:observed_on">
          <Stack isInline={true}>
            <Text mr={1}>
              {dt?.temporalCoverageDateAccuracy === DATE_ACCURACY.UNKNOWN
                ? t("common:unknown")
                : formatDateReadableFromUTC(dt?.temporalCoverageFromDate)}
            </Text>
            {dt?.temporalCoverageDateAccuracy === DATE_ACCURACY.ACCURATE && (
              <Tooltip
                title={t("form:date_accuracy_options.accurate")}
                shouldWrapChildren={true}
                hasArrow={true}
              >
                <CheckIcon color="green.500" />
              </Tooltip>
            )}
          </Stack>
        </ResponsiveInfo>

        <ResponsiveInfo title="form:created_on">
          <Stack isInline={true}>
            <Text mr={1}>{formatDateReadableFromUTC(dt?.createdOn)}</Text>
          </Stack>
        </ResponsiveInfo>
        {dt?.description && (
          <ResponsiveInfo title="form:description.title">
            <Box
              as={HTMLContainer}
              gridColumn="2/5"
              dangerouslySetInnerHTML={{
                __html: getInjectableHTML(dt?.description)
              }}
            ></Box>
          </ResponsiveInfo>
        )}
        {dt?.summary && (
          <ResponsiveInfo title="datatable:summary">
            <Box
              as={HTMLContainer}
              gridColumn="2/5"
              dangerouslySetInnerHTML={{
                __html: getInjectableHTML(dt?.summary)
              }}
            ></Box>
          </ResponsiveInfo>
        )}

        {dt?.geographicalCoverageLocationScale && (
          <ResponsiveInfo title="datatable:location_scale">
            <Box as={HTMLContainer} gridColumn="2/5">
              {covertToSentenceCase(dt?.geographicalCoverageLocationScale)}
            </Box>
          </ResponsiveInfo>
        )}
        {dt?.methods && (
          <ResponsiveInfo title="datatable:methods">
            <Box
              as={HTMLContainer}
              gridColumn="2/5"
              dangerouslySetInnerHTML={{
                __html: getInjectableHTML(dt?.methods)
              }}
            ></Box>
          </ResponsiveInfo>
        )}
        {dt?.partyAttributions && (
          <ResponsiveInfo title="datatable:attribution">
            <Box
              as={HTMLContainer}
              gridColumn="2/5"
              dangerouslySetInnerHTML={{
                __html: getInjectableHTML(dt?.partyAttributions)
              }}
            ></Box>
          </ResponsiveInfo>
        )}
        {dt?.project && (
          <ResponsiveInfo title="datatable:project">
            <Box as={HTMLContainer} gridColumn="2/5">
              {covertToSentenceCase(dt?.project)}
            </Box>
          </ResponsiveInfo>
        )}

        {dt?.basisOfData && (
          <ResponsiveInfo title="datatable:basis_of_data">
            <Box as={HTMLContainer} gridColumn="2/5">
              {covertToSentenceCase(dt?.basisOfData)}
            </Box>
          </ResponsiveInfo>
        )}
        {dt?.basisOfRecord && (
          <ResponsiveInfo title="datatable:basis_of_record">
            <Box as={HTMLContainer} gridColumn="2/5">
              {covertToSentenceCase(dt?.basisOfRecord)}
            </Box>
          </ResponsiveInfo>
        )}
        {dt?.dataTableType && (
          <ResponsiveInfo title="datatable:type">
            <Box as={HTMLContainer} gridColumn="2/5">
              {covertToSentenceCase(dt?.dataTableType)}
            </Box>
          </ResponsiveInfo>
        )}

        <ResponsiveInfo title="datatable:is_verified">
          <Stack isInline={true}>
            {dt?.isVerified ? <CheckIcon color="green.500" /> : <CrossIcon color="red.500" />}
          </Stack>
        </ResponsiveInfo>
      </SimpleGrid>
    </Box>
  );
}
