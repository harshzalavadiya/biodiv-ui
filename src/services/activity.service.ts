import { ENDPOINT, PAGINATION_LIMIT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { plainHttp } from "@utils/http";

export const axListActivity = async (
  objectType,
  objectId,
  offset = 0,
  limit = PAGINATION_LIMIT
) => {
  try {
    const res = await plainHttp.get(
      `${ENDPOINT.ACTIVITY}/v1/service/ibp/${objectType}/${objectId}`,
      { params: { offset, limit } }
    );
    return {
      success: true,
      data: res.data.activity,
      offset: offset + res.data.activity.length,
      hasMore: res.data.activity.length === limit,
      commentCount: res.data.commentCount
    };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axAddAcitivityComment = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(
      `${ENDPOINT.ACTIVITY}/v1/service/add/comment/${payload.rootHolderType}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axAddObservationComment = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(`${ENDPOINT.OBSERVATION}/v1/observation/add`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axAddDocumentComment = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(`${ENDPOINT.DOCUMENT}/v1/services/add/comment`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axAddSpeciesComment = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(`${ENDPOINT.SPECIES}/v1/species/add/comment`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
