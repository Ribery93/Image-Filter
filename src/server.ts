import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {constants} from "http2";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get( "/filteredimage", async (req:express.Request, res:express.Response) => {
    let {image_url} = req.query;
    if (!image_url){
      res.status(constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE).send('Error : Empty image url submitted');
    } else {
      await filterImageFromURL(image_url).then( function (filtered_path){
        res.status(constants.HTTP_STATUS_OK).sendFile(filtered_path, () => {
          deleteLocalFiles([filtered_path]);
        });
      }).catch(()=> res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send('The image can not be filtered - check the link submitted '));
    }
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("[SEARCH IMAGE] - [GET] => /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();