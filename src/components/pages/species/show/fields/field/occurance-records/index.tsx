import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { BaseLayer } from "@ibp/naksha-commons";
import { axGetObservationMapData } from "@services/observation.service";
import { ENDPOINT } from "@static/constants";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import LazyLoad from "react-lazyload";

import useSpecies from "../../../use-species";

const NakshaMapboxList: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxList),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const onObservationGridHover = ({ feature }: any) => (
  <div>{feature?.properties?.count} Observations</div>
);

export default function OccuranceRecoardSpeciesField({ valueCallback }) {
  const { species } = useSpecies();
  const defaultViewPort = React.useMemo(() => getMapCenter(3.1), []);
  const { lang } = useTranslation();

  useEffect(() => {
    valueCallback(true);
  }, []);

  const fetchGridData = async (geoProps) => {
    const params = {
      ...geoProps,
      taxon: species.taxonomyDefinition.id,
      view: "map"
    };

    const { data } = await axGetObservationMapData(params);
    return data;
  };

  return (
    <LazyLoad once={true}>
      <Box h="500px" overflow="hidden" position="relative" borderRadius="md" bg="gray.300" mb={4}>
        <NakshaMapboxList
          viewPort={defaultViewPort}
          loadToC={false}
          showToC={false}
          lang={lang}
          baseLayer={BaseLayer.MAP_SATELLITE}
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          nakshaApiEndpoint={ENDPOINT.NAKSHA}
          geoserver={{
            endpoint: ENDPOINT.GEOSERVER,
            store: SITE_CONFIG.GEOSERVER.STORE,
            workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
          }}
          layers={[
            {
              id: "species-observations",
              title: "Species Observations",
              isAdded: true,
              source: { type: "grid", fetcher: fetchGridData },
              onHover: onObservationGridHover
            }
          ]}
        />
      </Box>
    </LazyLoad>
  );
}
