import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

import path  from 'path';
import fs from 'fs';


(async () => {

  let mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
  };

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  app.use(express.static('public'));

  // Use to serve static assets (images)
  app.get( "/filteredimage", async ( req, res ) => {
    let { image_url } = req.query;


    if (!image_url) {
      res.status(422);
      return res.send(`No image url supplied` );
    } 
    
      const outpath = await filterImageFromURL(image_url);
      let extensions:Array<string> = outpath.split(".")
      let extension:string = extensions[extensions.length - 1]
      let type:string = mime[extension] || 'text/plain';

      // res.sendFile(outpath)
      res.sendFile(path.resolve(outpath), function(err) {
        if (err) {
          console.log("sendFile error: ", err)
        } else {
          console.log("sent file: ", outpath)
          deleteLocalFiles( [ outpath])
        }
      });

    // Another option for sending the image file
    //   var s = fs.createReadStream(outpath);
    //   s.on('open', function () {
    //       res.set('Content-Type', type);
    //       s.pipe(res);
    //   });
    //   s.on('close', function () {
    //     res.set('Content-Type', type);
    //     s.pipe(res);
    // });
    //   s.on('error', function () {
    //       res.set('Content-Type', 'text/plain');
    //       res.status(404).end('Not found');
    //   });


  } );

    // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();