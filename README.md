# Campus Map - Princeton and Slavery Project

This is the GitHub repository for the interactive campus map of the Princeton and Slavery Project. This README contains information about how the site is implemented, how it's intended to be published, and how content is to be added.

## Repository Structure

For developing and testing purposes, this repository's main directory has the structure of a Node.js application. However, the site itself doesn't require Node.js or any other server-side technology. It is implemented entirely in HTML + CSS + JavaScript, and should work when uploaded on a simple, static file-sharing server.

The entire site is contained in the "public" directory. The Node.js app runs a simple static file server on this directory, for testing purposes. For publishing, simply copy the contents of "public" into the appropriate directory in the server.

For testing with Node.js, simply run "npm start" to start up the web server. Connect to it through your browser using the URL "localhost:8080".

## Site Content

This website is structured as a web service that displays a map of Princeton campus. It uses Leaflet for setting up the JS interactive map, and Mapbox for the map image tiles. The site then downloads and parses all the location data (building/site names, shapes, descriptions, images, subsites, etc), which it displays as highlighted buildings on the map that the user can interact with.

**All location data used by the site is located in the "public/content" directory.**

### Editing Building Info

Editing the information of an existing building is designed to be simple. A building will always have an entry in the file "public/content/location_data.json" with at least its name. This file follows the standard JSON file format. The building might also have fields corresponding to its description text file in the "public/content/descriptions" folder, the name of its image in the "public/content/images" folder, and a list of subsites with their respective names and description files. Changing a building's description, image, and subsite names should be straightforward with this information.

**NOTE: Do NOT change building names only through "public/content/location_data.json",** since they are linked by their names to their respective shape data in the file "public/content/location_coords.json". If you want to change a building name, change it in both these JSON files.

### Adding/Activating New Buildings

*Requires Node.js*

Adding or activating a new building to the map is not as straightforward, but it's still easy. The tricky part is linking new building information in "location_data.json" to a new building outline in "location_coords.json", which we will have to draw. **Always make sure to back up the "public/content" directory,** as it contains the important data of the site.

To add a new building, follow these steps:

1. Add a new entry to "public/content/location_data.json" for the building. You only really need to set its name at this point.

2. We will be using Node.js. Make sure to install all Node.js modules for the project using "npm install".

3. While in the main directory of the repository, run "npm run loc". This will start a web server with an application that allows you to edit the building coordinates or outlines for all the buildings listed in "location_data.json".

4. Connect to the web app through your browser using the URL "localhost:8080".

5. Using the PREV and NEXT buttons on the lower right, find the new building you added to "location_data.json".

6. Press "Edit Coordinates" to draw the outline of the building. The cursor should change to a crosshair, and you should be able to select the corners of the polygon which will be used as a building outline. I recomment zooming in quite close to the building so that the outline is accurate. At any time, you can Undo the last point you clicked, or Cancel the outline drawing.

7. Press Done when you've drawn the entire outline (note that it's not necessary to close up the last point with itself). The building outline should be saved temporarily in the site. Make sure not to refresh the page, as the original building data will be reloaded and all your changes will be lost.

8. Press SAVE ALL CHANGES in the bottom left to upload the file back to Node.js.

9. A new "location_coords.json" should be created under "tools/locations", with the new building outline added. Simply move this file over to "public/content". You can now close the Node.js server.

10. The building should now be activated. Test it by running "npm start" and connecting to the site.