import { SpatialReference } from '@arcgis/core/geometry';
export const resolution = 2;
export const scaleThreshold = 7000000;
export const marsSR = new SpatialReference({ wkid: 104971 });

export const highlightStyles: Record<string, __esri.SimpleFillSymbolProperties> = {
  path: {
    color: [255, 163, 32, 0],
    outline: {
      color: [255, 163, 32, 1],
      width: 3
    }
  },
  current: {
    color: [0, 255, 0, 0.1],
    outline: {
      color: [0, 255, 0, 0.3],
      width: 3
    }
  },
  purpose: {
    color: [255, 223, 0, 0.1],
    outline: {
      color: [255, 223, 0, 0.3],
      width: 2
    }
  },
  warning: {
    color: [255, 255, 0, 0.1],
    outline: {
      color: [255, 255, 0, 0.3],
      width: 2
    }
  },
  error: {
    color: [255, 0, 0, 0.1],
    outline: {
      color: [255, 0, 0, 0.3],
      width: 2
    }
  }
};

export const mapServer = {
  "currentVersion": 10.9,
  "serviceDescription": "Mars MDIM2.1 mosaic, arcgis.com service",
  "mapName": "MDIM2.1",
  "description": "This global image map of Mars has a native resolution of 231 m/pixel at the equator. The colorized mosaic was completed by NASA AMES which warped the original Viking colorized mosaic and blended it over the latest black/white Viking-based Mars Digital Image Model (MDIM 2.1) created by the USGS. The positional accuracy of features in MDIM 2.1 is estimated to be roughly one pixel (200 m). This mosaic uses the most recent coordinate system definitions for Mars. As a result, MDIM 2.1 not only registers precisely with data from current missions such as Mars Global Surveyor (MGS) and 2001 Mars Odyssey but will serve as an accurate base map on which data from future missions can be plotted. All data used in the construction of this Viking global mosaic have been publicly released and are freely available via the NASA Planetary Data System. This tiled web service, as hosted by Esri, is made available using lossy Jpeg compression",
  "copyrightText": "Source: NASA/JPL/USGS/Esri",
  "supportsDynamicLayers": false,
  "layers": [],
  "tables": [],
  "spatialReference": {
    "wkid": 104971,
    "latestWkid": 104971,
    "wkt": "GEOGCS[\"GCS_Mars_2000_Sphere\",DATUM[\"D_Mars_2000_Sphere\",SPHEROID[\"Mars_2000_Sphere_IAU_IAG\",3396190.0,0.0]],PRIMEM[\"Reference_Meridian\",0.0],UNIT[\"Degree\",0.0174532925199433]]"
  },
  "singleFusedMapCache": true,
  "tileInfo": {
    "rows": 512,
    "cols": 512,
    "dpi": 96,
    "format": "JPG",
    "origin": {
      "x": -180,
      "y": 90
    },
    "spatialReference": {
      "wkid": 104971,
      "latestWkid": 104971,
      "wkt": "GEOGCS[\"GCS_Mars_2000_Sphere\",DATUM[\"D_Mars_2000_Sphere\",SPHEROID[\"Mars_2000_Sphere_IAU_IAG\",3396190.0,0.0]],PRIMEM[\"Reference_Meridian\",0.0],UNIT[\"Degree\",0.0174532925199433]]"
    },
    "lods": [
      {
        "level": 0,
        "resolution": 0.3515625,
        "scale": 78760513.4003741
      },
      {
        "level": 1,
        "resolution": 0.17578125,
        "scale": 39380256.70018705
      },
      {
        "level": 2,
        "resolution": 0.087890625,
        "scale": 19690128.350093525
      },
      {
        "level": 3,
        "resolution": 0.043945312,
        "scale": 9845064.175046762
      },
      {
        "level": 4,
        "resolution": 0.02197265625,
        "scale": 4922532.087523381
      },
      {
        "level": 5,
        "resolution": 0.010986328125,
        "scale": 2461266.0437616906
      },
      {
        "level": 6,
        "resolution": 0.0054931640625,
        "scale": 1230633.0218808453
      },
      {
        "level": 7,
        "resolution": 0.00274658203125,
        "scale": 615316.5109404227
      },
      {
        "level": 8,
        "resolution": 0.001373291015625,
        "scale": 307658.2554702113
      },
      {
        "level": 9,
        "resolution": 0.0006866455078125,
        "scale": 153829.12773510566
      },
      {
        "level": 10,
        "resolution": 0.00034332275390625,
        "scale": 76914.56386755283
      },
      {
        "level": 11,
        "resolution": 0.000171661376953125,
        "scale": 38457.281933776416
      },
      {
        "level": 12,
        "resolution": 0.0000858306884765625,
        "scale": 19228.640966888208
      },
      {
        "level": 13,
        "resolution": 0.00004291534423828125,
        "scale": 9614.320483444104
      },
      {
        "level": 14,
        "resolution": 0.000021457672119140625,
        "scale": 4807.160241722052
      },
      {
        "level": 15,
        // eslint-disable-next-line no-loss-of-precision
        "resolution": 0.000010728836059570312,
        "scale": 2403.580120861026
      },
      {
        "level": 16,
        "resolution": 0.000005364418029785156,
        "scale": 1201.790060430513
      },
      {
        "level": 17,
        "resolution": 0.000002682209014892578,
        "scale": 600.8950302152565
      }
    ]
  },
  "initialExtent": {
    "xmin": -179.99999999,
    "ymin": -89.99999999,
    "xmax": 179.99999999,
    "ymax": 89.99999999,
    "spatialReference": {
      "wkid": 104971,
      "latestWkid": 104971,
      "wkt": "GEOGCS[\"GCS_Mars_2000_Sphere\",DATUM[\"D_Mars_2000_Sphere\",SPHEROID[\"Mars_2000_Sphere_IAU_IAG\",3396190.0,0.0]],PRIMEM[\"Reference_Meridian\",0.0],UNIT[\"Degree\",0.0174532925199433]]"
    }
  },
  "fullExtent": {
    "xmin": -180,
    "ymin": -90,
    "xmax": 180,
    "ymax": 90,
    "spatialReference": {
      "wkid": 104971,
      "latestWkid": 104971,
      "wkt": "GEOGCS[\"GCS_Mars_2000_Sphere\",DATUM[\"D_Mars_2000_Sphere\",SPHEROID[\"Mars_2000_Sphere_IAU_IAG\",3396190.0,0.0]],PRIMEM[\"Reference_Meridian\",0.0],UNIT[\"Degree\",0.0174532925199433]]"
    }
  },
  "minScale": 0,
  "maxScale": 0,
  "units": "esriMeters",
  "supportedImageFormatTypes": "JPG",
  "documentInfo": {
    "Title": "Mars MDIM Imagery",
    "Author": "Esri",
    "Comments": "",
    "Subject": "imagery, satellite, Mars, MDIM",
    "Category": "imageryBaseMapsMarsCover (Imagery, basemaps)",
    "AntialiasingMode": "None",
    "TextAntialiasingMode": "Force",
    "Keywords": "Mars, NASA, Global, MDIM, Viking, AMES"
  },
  "capabilities": "Map, TilesOnly",
  "supportedQueryFormats": "JSON",
  "exportTilesAllowed": false
}
