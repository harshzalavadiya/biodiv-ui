import { Box, Button, FormControl, FormHelperText, FormLabel, Input, Text } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import AddIcon from "@icons/add";
import { axQueryGeoEntitiesByPlaceName } from "@services/geoentities.service";
import { isBrowser } from "@static/constants";
import { feature } from "@turf/helpers";
import pointOnFeature from "@turf/point-on-feature";
import { getMapCenter } from "@utils/location";
import debounce from "debounce-promise";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import wkt from "wkt";

const NakshaGmapsDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaGmapsDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const defaultViewPort = getMapCenter(2.8);

const onQuery = async (q) => {
  const { data } = await axQueryGeoEntitiesByPlaceName(q);
  return data.map(({ placeName, wktData, id }) => ({
    geoEntityId: id,
    label: placeName,
    value: wkt.parse(wktData)
  }));
};

export default function WKTSearch({
  labelTitle,
  nameTitle,
  nameTopology,
  centroid,
  onSave,
  isDisabled = false,
  mb = 2
}) {
  const [selected, setSelected] = useState<any>();
  const onQueryDebounce = debounce(onQuery, 200);
  const gmapsSearchRef = useRef<any>(null);
  const { t } = useTranslation();

  const handleOnSave = () => {
    if (selected?.label && selected?.value) {
      const { label, value, geoEntityId } = selected;
      onSave({
        geoEntityId,
        [nameTitle]: label,
        [nameTopology]: wkt.stringify(value),
        [centroid]: pointOnFeature(feature(value))
      });
      setSelected(null);
    }
  };

  const handleOnChange = (value) => {
    const label = value?.[0]?.properties?.formatted_address;
    if (label) {
      setSelected({ label, value: value[0] });
      gmapsSearchRef.current.value = "";
    }
  };

  return (
    <Box mb={mb}>
      <div data-hidden={!SITE_CONFIG.DOCUMENT.GEOENTITY_SEARCH}>
        <FormControl>
          <FormLabel htmlFor="geoentities-search">{labelTitle}</FormLabel>
          <AsyncSelect
            name="geoentities-search"
            id="geoentities-search"
            value={selected}
            menuPortalTarget={isBrowser && document.body}
            isSearchable={true}
            isClearable={true}
            noOptionsMessage={() => null}
            onChange={setSelected}
            placeholder={t("form:geoentities")}
            loadOptions={onQueryDebounce}
          />
        </FormControl>
        <Text color="gray.500" mb={2} children={t("common:or")} />
      </div>
      <Box position="relative" borderRadius="md" mb={4}>
        <NakshaGmapsDraw
          defaultViewPort={defaultViewPort}
          defaultFeatures={selected?.value ? [selected?.value] : []}
          isControlled={true}
          isAutocomplete={true}
          isReadOnly={true}
          onFeaturesChange={handleOnChange}
          gmapRegion={SITE_CONFIG.MAP.COUNTRY}
          gmapApiAccessToken={SITE_CONFIG.TOKENS.GMAP}
          mapStyle={{ height: "22rem", width: "100%", borderRadius: ".25rem" }}
          autocompleteComponent={
            <FormControl mb={4}>
              <FormLabel htmlFor="gmaps-search">{t("form:find_gmaps")}</FormLabel>
              <Input ref={gmapsSearchRef} w="full" />
              <FormHelperText>{t("form:coverage.hint")}</FormHelperText>
            </FormControl>
          }
        />
      </Box>
      <Button
        type="button"
        colorScheme="blue"
        maxW="6rem"
        leftIcon={<AddIcon />}
        isDisabled={isDisabled}
        onClick={handleOnSave}
      >
        {t("common:add")}
      </Button>
    </Box>
  );
}
