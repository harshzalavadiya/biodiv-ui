import useDidUpdateEffect from "@hooks/use-did-update-effect";
import useGlobalState from "@hooks/use-global-state";
import { ObservationData, ObservationFilterProps } from "@interfaces/custom";
import { SpeciesGroup } from "@interfaces/esmodule";
import { UserGroup, UserGroupIbp } from "@interfaces/observation";
import { axGetListData, axGetMaxVotedRecoPermissions } from "@services/observation.service";
import { axGetUserGroupList } from "@services/usergroup.service";
import { isBrowser } from "@static/constants";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { stringify } from "@utils/query-string";
import NProgress from "nprogress";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

const deDupeObservations = (existingObservations, newObservations) => {
  const existingIDs = existingObservations.map(({ observationId }) => observationId);
  return newObservations?.filter(({ observationId }) => !existingIDs.includes(observationId));
};

interface ObservationFilterContextProps {
  filter?: ObservationFilterProps;
  observationData: ObservationData;
  location;
  setObservationData?;
  totalCount?;
  observationListAdd?;
  setFilter?;
  addFilter?;
  removeFilter?;
  children?;
  nextPage?;
  resetFilter?;
  speciesGroup?: SpeciesGroup[];
  userGroup?: UserGroup[];
  states?: string[];
  traits?;
  customFields?;
  loggedInUserGroups?: UserGroupIbp[];
}

const ObservationFilterContext = createContext<ObservationFilterContextProps>(
  {} as ObservationFilterContextProps
);

export const ObservationFilterProvider = (props: ObservationFilterContextProps) => {
  const initialOffset = props?.filter?.offset || 0;
  const [filter, setFilter] = useImmer<{ f: any }>({ f: props.filter });
  const [observationData, setObservationData] = useImmer<any>(props.observationData);
  const { isLoggedIn } = useGlobalState();
  const [loggedInUserGroups, setLoggedInUserGroups] = useState<any[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      axGetUserGroupList().then(({ data }) => setLoggedInUserGroups(data));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify({ ...filter.f, offset: initialOffset })}`);
    }
  }, [filter]);

  const updateMaxVotedRecoPermissions = async (observationList) => {
    if (isLoggedIn) {
      const payload = observationList.reduce((acc, cv) => {
        const taxonId = cv?.recoShow?.recoIbp?.taxonId;
        return taxonId ? { ...acc, [cv.observationId]: taxonId } : acc;
      }, {});
      const mvp = await axGetMaxVotedRecoPermissions(payload);
      setObservationData((_draft: any) => {
        _draft.mvp = { ..._draft.mvp, ...mvp.data };
      });
    }
  };

  useEffect(() => {
    updateMaxVotedRecoPermissions(observationData?.l);
  }, [isLoggedIn]);

  const fetchListData = async () => {
    try {
      NProgress.start();

      // Reset list data if params are changed
      if (filter.f?.offset === 0) {
        setObservationData((_draft) => {
          _draft.l = [];
          _draft.ml = [];
        });
      }
      const { location, ...otherValues } = filter.f;
      const { data } = await axGetListData(
        { ...otherValues },
        props.location ? { location: props.location } : location ? { location } : {}
      );
      updateMaxVotedRecoPermissions(data?.observationList);
      setObservationData((_draft) => {
        if (data?.geohashAggregation) {
          _draft.l = data?.geohashAggregation;
        } else if (data.observationList?.length) {
          _draft.l.push(...deDupeObservations(_draft.l, data.observationList));
          _draft.hasMore = data.observationList?.length === Number(filter.f.max);
        } else {
          _draft.ml.push(...deDupeObservations(_draft.ml, data.observationListMinimal));
          _draft.hasMore = data?.observationListMinimal?.length === Number(filter.f.max);
        }
        _draft.n = data.totalCount;
        if (data?.aggregationData) {
          _draft.ag = data.aggregationData;
        }
      });
      NProgress.done();
    } catch (e) {
      console.error(e);
      NProgress.done();
    }
  };

  useDidUpdateEffect(() => {
    fetchListData();
  }, [filter]);

  const addFilter = (key, value) => {
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f[key] = value;
    });
  };

  const removeFilter = (key) => {
    setFilter((_draft) => {
      delete _draft.f[key];
    });
  };

  const nextPage = (max = LIST_PAGINATION_LIMIT) => {
    setFilter((_draft) => {
      _draft.f.offset = Number(_draft.f.offset) + max;
    });
  };

  const resetFilter = () => {
    setFilter((_draft) => {
      _draft.f = DEFAULT_FILTER;
    });
  };

  const observationListAdd = (items) => {
    setObservationData((_draft) => {
      _draft.l.push(...items);
    });
  };

  return (
    <ObservationFilterContext.Provider
      value={{
        filter: filter.f,
        observationData,
        setObservationData,
        observationListAdd,
        setFilter,
        addFilter,
        removeFilter,
        nextPage,
        resetFilter,
        loggedInUserGroups,

        // Config Properties
        speciesGroup: props.speciesGroup,
        userGroup: props.userGroup,
        location: props.location,
        states: props.states,
        traits: props.traits,
        customFields: props.customFields
      }}
    >
      {props.children}
    </ObservationFilterContext.Provider>
  );
};

export default function useObservationFilter() {
  return useContext(ObservationFilterContext);
}
