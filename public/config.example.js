/**
 * Copy this file top config.js and add your API keys below
 */

export const mapbox =  {
    style: "styles/v1/{username}/{style}",
    accessToken: "{accessKey}",
    options: {
        /* all options when initializing Leaflet */
        /*
            center,
            zoom,
            zoomSnap,
            zoomDelta,
            zoomControl,
        */
    },
};

export default { mapbox };
