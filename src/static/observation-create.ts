import { IndexedDBConfig } from "use-indexeddb/src/interfaces";

export const STORE = {
  ASSETS: "assets",
  PENDING_OBSERVATIONS: "pending-observations"
};

export const DB_CONFIG: IndexedDBConfig = {
  databaseName: "ibp",
  version: 3,
  stores: [
    {
      name: STORE.ASSETS,
      id: { keyPath: "id", autoIncrement: true },
      indices: [
        { name: "hashKey", keyPath: "hashKey", options: { unique: true } },
        { name: "fileName", keyPath: "fileName" },
        { name: "path", keyPath: "path" },
        { name: "type", keyPath: "type" },
        { name: "license", keyPath: "license" },
        { name: "status", keyPath: "status" },
        { name: "caption", keyPath: "caption" },
        { name: "ratings", keyPath: "ratings" },
        { name: "latitude", keyPath: "latitude" },
        { name: "longitude", keyPath: "longitude" },
        { name: "blob", keyPath: "blob" },
        { name: "isUsed", keyPath: "isUsed" },
        { name: "dateCreated", keyPath: "dateCreated" },
        { name: "dateUploaded", keyPath: "dateUploaded" }
      ]
    },
    {
      name: STORE.PENDING_OBSERVATIONS,
      id: { keyPath: "id", autoIncrement: true },
      indices: [{ name: "data", keyPath: "data" }]
    }
  ]
};

export const ASSET_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio"
};

export const OBSERVATION_FIELDS = [
  {
    label: "Species Group",
    value: "sGroup"
  },
  {
    label: "Checklist Annotation",
    value: "checklistAnnotation"
  },
  {
    label: "From Date",
    value: "fromDate"
  },
  {
    label: "geoPrivacy",
    value: "geoPrivacy"
  },
  {
    label: "To Date",
    value: "toDate"
  },
  {
    label: "Observed At",
    value: "observedAt"
  },
  {
    label: "User",
    value: "user"
  },
  {
    label: "Location Scale",
    value: "locationScale"
  },
  {
    label: "Longitude",
    value: "longitude"
  },
  {
    label: "Latitude",
    value: "latitude"
  },
  {
    label: "Date Accuracy",
    value: "dateAccuracy"
  },
  {
    label: "Notes",
    value: "notes"
  },
  {
    label: "Filename",
    value: "fileName"
  },
  {
    label: "Common Name",
    value: "commonName"
  },
  {
    label: "Comment",
    value: "comment"
  },
  {
    label: "Scientific Name",
    value: "scientificName"
  },
  {
    label: "Tags",
    value: "tags"
  },
  {
    label: "License",
    value: "license"
  },
  {
    label: "Geo Privacy",
    value: "geoPrivacy"
  },
  {
    label: "User Groups",
    value: "userGroups"
  }
];

export const LOCAL_ASSET_PREFIX = "ibpmu-";
