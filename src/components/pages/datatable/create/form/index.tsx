import { useLocalRouter } from "@components/@core/local-link";
import { CheckboxField } from "@components/form/checkbox";
import { SubmitButton } from "@components/form/submit-button";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axBulkObservationData } from "@services/observation.service";
import { DEFAULT_BASIS_OF_DATA, DEFAULT_BASIS_OF_RECORD } from "@static/datatable";
import { dateToUTC } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import PartyContributorsForm from "./contributor";
import LocationPicker from "./geographic";
import Others from "./others";
import TaxonomyCovergae from "./taxonomic-coverage";
import TemporalCoverage from "./temporal-coverage";
import TitleInput from "./title";
import ImageUploaderField from "./uploader";

export default function DataTableCreateForm({ speciesGroups, languages, datasetId }) {
  const { t } = useTranslation();
  const { user } = useGlobalState();
  const router = useLocalRouter();

  const [fieldMapping, setFieldMapping] = useState<any>({});
  const [showMapping, setShowMapping] = useState<boolean>(false);

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required(),
        summary: Yup.string().required().max(255),
        description: Yup.string(),
        languageId: Yup.number().required(),
        filename: Yup.string().required(),
        contributors: Yup.number().required(),
        attribution: Yup.string(),
        sgroup: Yup.number().required(),
        basisOfData: Yup.string().required(),
        basisOfRecord: Yup.string().required(),

        observedDateRange: Yup.array(),
        project: Yup.string(),
        methods: Yup.string(),
        isVerified: Yup.boolean(),

        // Date and Location
        dateAccuracy: Yup.string().required(),
        locationScale: Yup.string().required(),
        topologyData: Yup.array()
          .required()
          .length(1)
          .of(
            Yup.object().shape({
              id: Yup.mixed().nullable(),
              placename: Yup.string().required(),
              topology: Yup.string().required(),
              centroid: Yup.object().required()
            })
          ),
        useDegMinSec: Yup.boolean(),
        hidePreciseLocation: Yup.boolean(),
        terms: Yup.boolean().oneOf([true], "The terms and conditions must be accepted."),
        columnsMapping: Yup.array().required()
      })
    ),
    defaultValues: {
      languageId: 205,
      basisOfData: DEFAULT_BASIS_OF_DATA,
      basisOfRecord: DEFAULT_BASIS_OF_RECORD,
      isVerified: false,
      contributors: user.id,
      terms: true
    }
  });

  const parseColumnData = (columnsMapping) => {
    const columns = {};
    const checklistAnnotation = {};

    columnsMapping.map((item, index) => {
      if (item?.fieldKey === "checklistAnnotation") {
        checklistAnnotation[fieldMapping.headerData[index]] = index;
      } else if (item?.fieldKey) {
        columns[item.fieldKey] = index;
      }
    });

    return { columns, checklistAnnotation };
  };

  const handleFormSubmit = async ({
    columnsMapping,
    observedDateRange,
    observedFromDate,
    observedToDate,
    topologyData,
    isVerified,
    ...props
  }) => {
    const { columns, checklistAnnotation } = parseColumnData(columnsMapping);
    const {
      placename,
      topology,
      centroid: {
        geometry: { coordinates }
      }
    } = topologyData[0];

    const payload = {
      columns,
      checklistAnnotation,
      observedFromDate: dateToUTC(observedDateRange[0]).format(),
      observedAt: placename,
      reverseGeocoded: placename,
      longitude: coordinates[0],
      latitude: coordinates[1],
      isVerified: !!isVerified,
      observedToDate:
        dateToUTC(observedDateRange[1]).format() || dateToUTC(observedDateRange[0]).format(),
      wktString: topology,
      useDegMinSec: false,
      licenseId: SITE_CONFIG.LICENSE.DEFAULT,
      dataset: datasetId || null,
      createdOn: dateToUTC().format(),
      ...props
    };

    const { success, data } = await axBulkObservationData(payload);

    if (success) {
      notification(t("datatable:notifications.success"), NotificationType.Success);
      router.push(`/datatable/show/${data}`, true);
    } else {
      notification(t("datatable:notifications.error"));
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
        <ImageUploaderField
          showMapping={showMapping}
          fieldMapping={fieldMapping}
          setFieldMapping={setFieldMapping}
          setShowMapping={setShowMapping}
          name="filename"
        />
        <TitleInput languages={languages} />
        <TemporalCoverage />
        <TaxonomyCovergae speciesGroups={speciesGroups} />
        <LocationPicker />
        <PartyContributorsForm />
        <Others />
        <CheckboxField name="terms" label={t("form:terms")} />
        <SubmitButton leftIcon={<CheckIcon />}>{t("datatable:add")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
