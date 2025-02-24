export interface Stats {
  tags: Record<string, number>;
  buildings: number;
  buildingsAdded: number;
  buildingsModified: number;
  buildingsDeleted: number;
  highways: number;
  highwaysAdded: number;
  highwaysModified: number;
  highwaysDeleted: number;
  other: number;
  otherAdded: number;
  otherModified: number;
  otherDeleted: number;
  users: Record<string, number>;
}

export function calculateStats(geojson: GeoJSON.FeatureCollection) {
  const stats = {
    tags: {},
    buildings: 0,
    buildingsAdded: 0,
    buildingsModified: 0,
    buildingsDeleted: 0,
    highways: 0,
    highwaysAdded: 0,
    highwaysModified: 0,
    highwaysDeleted: 0,
    other: 0,
    otherAdded: 0,
    otherModified: 0,
    otherDeleted: 0,
    users: {},
  } as Stats;

  for (const feature of geojson.features) {
    if (!feature.properties) {
      continue;
    }

    const changeType = feature.properties.changeType;
    if (
      changeType === "added" ||
      changeType === "modifiedNew" ||
      changeType === "deletedNew"
    ) {
      const user = feature.properties.user;
      const tags = JSON.parse(feature.properties.tags);

      if (changeType === "added") {
        if (tags.building) {
          stats.buildings += 1;
          stats.buildingsAdded += 1;
        } else if (tags.highway) {
          stats.highways += 1;
          stats.highwaysAdded += 1;
        } else {
          stats.other += 1;
          stats.otherAdded += 1;
        }
      }
      if (changeType === "modifiedNew") {
        if (tags.building) {
          stats.buildings += 1;
          stats.buildingsModified += 1;
        } else if (tags.highway) {
          stats.highways += 1;
          stats.highwaysModified += 1;
        } else {
          stats.other += 1;
          stats.otherModified += 1;
        }
      }
      if (changeType === "deletedNew") {
        if (tags.building) {
          stats.buildings += 1;
          stats.buildingsDeleted += 1;
        } else if (tags.highway) {
          stats.highways += 1;
          stats.highwaysDeleted += 1;
        } else {
          stats.other += 1;
          stats.otherDeleted += 1;
        }
      }

      Object.keys(tags).forEach((k) => {
        stats.tags[k] = (stats.tags[k] || 0) + 1;
      });
      stats.users[user] = (stats.users[user] || 0) + 1;
    }
  }

  return stats;
}
