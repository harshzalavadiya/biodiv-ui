import { ENDPOINT } from "@static/constants";
import { OBSERVATION_FALLBACK } from "@static/inline-images";
import { ASSET_TYPES } from "@static/observation-create";

export const RESOURCE_CTX = {
  OBSERVATION: "OBSERVATION",
  MY_UPLOADS: "MY_UPLOADS",
  SPECIES: "SPECIES",
  USERGROUPS: "USERGROUPS"
};

const RESOURCE_CTX_MAP = {
  SPECIES: "img",
  OBSERVATION: "observations",
  SPECIES_FIELD: "img",
  MY_UPLOADS: "myUploads",
  USERGROUPS: "userGroups"
};

const cleanSlashes = (path) => path.split("//").join("/");

/**
 * Parses YouTube video id from given Url
 * @param url
 * @returns YouTube video Id or blank
 */
export const getYouTubeId = (url) => {
  let ID = "";
  try {
    url = url.replace(/(>|<)/gi, "").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    } else {
      return;
    }
  } catch (e) {
    console.error(e);
  }
  return ID;
};

export const getYouTubeEmbed = (url) => {
  return `https://www.youtube.com/embed/${getYouTubeId(url)}`;
};

export const getYoutubeImage = (resourceUrl: string, size = "hqdefault") => {
  const ytid = getYouTubeId(resourceUrl);
  return ytid ? `https://i.ytimg.com/vi/${ytid}/${size}.jpg` : undefined;
};

export const getUserImage = (resourceUrl, name, w = 50) => {
  return resourceUrl
    ? resourceUrl.startsWith("http")
      ? resourceUrl
      : `${ENDPOINT.FILES}/get/crop/users${resourceUrl}?w=${w}`
    : `/api/avatar?t=${name}&s=${w}`;
};

export const getResourceThumbnail = (resourceType, resourceUrl, size) => {
  return resourceUrl
    ? `${ENDPOINT.FILES}/get/crop/${RESOURCE_CTX_MAP[resourceType]}/${resourceUrl}${size}`
    : undefined;
};

export const getResourceRAW = (resourceType, resourceUrl) => {
  return resourceUrl
    ? `${ENDPOINT.FILES}/get/raw/${RESOURCE_CTX_MAP[resourceType]}/${resourceUrl}`
    : undefined;
};

export const getTraitIcon = (resourceUrl, w = 40) => {
  return resourceUrl.startsWith("/next-assets/")
    ? resourceUrl
    : `${ENDPOINT.FILES}/get/crop/traits${resourceUrl}?w=${w}`;
};

export const getGroupImage = (resourceUrl) => {
  return `${ENDPOINT.FILES}/get/crop/userGroups${resourceUrl}`;
};

export const getGroupImageThumb = (resourceUrl, height = 32) => {
  return resourceUrl
    ? `${ENDPOINT.FILES}/get/crop/userGroups${resourceUrl}?h=${height}`
    : `/next-assets/species/Unknown.svg`;
};

export const getSuggestionIcon = (resourceUrl) => {
  return resourceUrl ? `${ENDPOINT.FILES}/get${cleanSlashes(resourceUrl)}?w=50` : undefined;
};

export const getLocalIcon = (icon, type = "species") =>
  `/next-assets/${type}/${icon || "Unknown"}.svg`;

export const getFallbackByMIME = (mime) => {
  const type = mime ? mime.toString().split("/")[0] : null;
  switch (type) {
    case ASSET_TYPES.IMAGE:
      return OBSERVATION_FALLBACK.PHOTO;

    case ASSET_TYPES.AUDIO:
      return OBSERVATION_FALLBACK.AUDIO;

    case ASSET_TYPES.VIDEO:
      return OBSERVATION_FALLBACK.VIDEO;

    default:
      return OBSERVATION_FALLBACK.DEFAULT;
  }
};

/**
 * Uses Google Docs viewer to avoid CORS issue
 *
 * @param {string} resourceUrl
 * @return {*}  {string}
 */
export const getDocumentPath = (resourceUrl: string): string => {
  return `https://docs.google.com/viewer?embedded=true&url=${getDocumentFilePath(resourceUrl)}`;
};

export const getDocumentFilePath = (resourceUrl: string): string => {
  return resourceUrl.startsWith("http")
    ? resourceUrl
    : `${ENDPOINT.RAW}/content/documents${resourceUrl}`;
};
