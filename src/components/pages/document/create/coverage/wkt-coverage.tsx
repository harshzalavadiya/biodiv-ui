import WKTFieldMulti from "@components/form/wkt-multi";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function WKTCoverage({
  name,
  nameTitle = "placename",
  nameTopology = "topology",
  centroid = "centroid"
}) {
  const { t } = useTranslation();

  return (
    <WKTFieldMulti
      name={name}
      label={t("form:coverage.spatial")}
      nameTitle={nameTitle}
      centroid={centroid}
      labelTitle={t("form:coverage.place")}
      nameTopology={nameTopology}
      labelTopology={t("form:coverage.wkt")}
    />
  );
}
