const express = require('express')
const { MongoClient } = require('mongodb')
const cors = require('cors')
//NOTE: We'll use MongoClient instead of axios
//const axios = require("axios");
const helmet = require('helmet')
const FormData = require('form-data')
const qs = require('qs')
const { ObjectId } = require('mongodb');
const WebSocket = require('ws');
const path = require('path');

// -- WARN: Is there a message at the top of this file asking to connect to MongoDB Atlas?
// -- If so, click the link and follow the instructions to connect your application to your cluster.
// Symptom is server responding to GETs not POSTs from app

// -- NOTE: Need to refresh and be on Rankings login page before re/starting the middleware server

// Now you can use the ObjectId in your code
const objectId = new ObjectId();

const wss = new WebSocket.Server({ noServer: true });

const expressapp = express()
const port = 3000

// NOTE: These next 2 expressions enable us to use this express server as our
// main application server for the static pages. This means eliminate 'Cannot GET' 
// errors in this context at least.
/* Chatgpt: 'Ideally, you want to have a single development server that serves both your API 
(handled by Express) and your Elm application.
The Elm application is handled by index.html, so all we need to do here is point to index.html
for static file handling
WARN: This fix is mainly for development as the route not an issue in production. However, if 
this middleware has to be updated in production at some point it is possible this change could affect
functionality (at least make a backup of original on prod server before updating)
*/
expressapp.use(express.static(path.join(__dirname, '../')));

expressapp.get('*', (req, res) => {
  /* console.log('Request URL:', req.url);
  console.log( console.log('response :', res)); */
  res.sendFile(path.join(__dirname, '../index.html'));
});



/* NOTE: The server listens for requests on port 3000 and has a multiple routes that accepts a string of query 
or post parameters. When the Elm client sends a GET or POST request to the routes, this server makes a corresponding GET or POST 
request to the third-party API server with the same query or post parameters (once extracted here) and returns the response to the Elm client as a JSON object.

/* ( "query_type", E.string "fetch" )
  ( "rankingid", E.string <| rankingId ) 

-- NOTE: Re-start the server on every change: node middleware/mongodbMW.js (from project root folder)

console.log('log here'); will log to the terminal, not the web console */

expressapp.use(cors())

// Middleware to parse JSON data in request body
expressapp.use(express.json())

// Allow requests from a specific origin
expressapp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

async function main() {
  // connect to your Atlas cluster
  // using the mongodb node.js driver package (above)
  // REVIEW: we're talking to it via http requests from Elm (not Elm ports)
  // that treat this similar to a proxy on port 27127(?)
  const uriAnonClient =
    'mongodb+srv://anon:1WouEkm5XlOTurNL@cluster0.7u22o.mongodb.net?retryWrites=true&w=majority'

  // Define a MongoDB client instance and a flag to track the connection status
  const client = new MongoClient(uriAnonClient)
  let isConnected = false

  // Initialize the anonymous client
  async function initializeMongoClient() {
    try {
      await client.connect();
      //client.on('error', console.error);
      console.log('Connected to MongoDB')
      isConnected = true

      // NOTE: Implement the change stream:
      // Select the database and collection to watch
      const db = client.db('sportrank');
      const collection = db.collection('rankings');

      // Create the change stream
      const changeStream = collection.watch([], { fullDocument: 'updateLookup' });

      // Specify what should happen when a change event is emitted
      changeStream.on('change', (change) => {
        //console.log('Change:', change);
      
        // Create a new object with only the properties you need
        const changeData = {
          operationType: change.operationType,
          documentKey: change.documentKey,
          updateDescription: change.updateDescription,
          fullDocument: change.fullDocument,
        };
      
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            console.log('Sending to client:', changeData);
            client.send(JSON.stringify(changeData));
           
          }
        });
      });


      // NOTE: Implement the search function:
      //'A' is just a placeholder as cannot be empty
      await searchIndex(' ')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
    }
  }

  //NAV: Functions
  async function searchIndex(queryString) {
    console.log('in searchIndex')
    // Ensure the client is connected before performing the search
    if (!isConnected) {
      console.error('MongoDB client is not connected.')
      return
    }

    try {
      // Access your collection
      const db = client.db('sportrank')
      const collection = db.collection('rankings')

      // Define the aggregation pipeline
      // NOTE: You can test this pipeline in Realm's function editor, but to actually
      // use it from mongo and not here you need to install the Realm Web SDK and
      // use it like: const functionResponse = await app.functions.myRealmFunction('arg1', 'arg2');
      // This can be considered if application gets much larger and prefer to manage functions in mongo
      // Considerations include: source control, mongo billing structure

      const agg = [
        {
          $search: {
            index: 'searchRankings', // Replace with your search index name
            autocomplete: {
              query: queryString,
              path: 'name', // Replace with the field to search
            },
          },
        },
        {
          $limit: 20, // Optional: Limit the number of results
        },
        {
          $project: {
            _id: { $toString: '$_id' }, // Include the "_id" field in the results
            name: 1, // Include the "name" field in the results
          },
        },
      ]
      console.log('ready to agg with qstring : ', queryString)
      // Run the aggregation pipeline
      const result = await collection.aggregate(agg).toArray()

      // Process and print the results
      //await result.forEach((doc) => console.log(doc))
      return result
    } catch (error) {
      console.error('Error in searchIndex:', error)
      return null // Return a default value or null
    }
  }

  // NOTE: Function to fetch a ranking (cannot use fetchedRankings.js due to anon login and realm app etc. issues)
  async function fetchRankingAsSpectator(rankingid) {
    console.log('in fetchRankingAsSpectator?')
    // Ensure the client is connected before performing the search
    if (!isConnected) {
      console.error('MongoDB client is not connected.')
      return
    }

    try {
      // Access your collection
      const db = client.db('sportrank')
      const collection = db.collection('rankings')

      // Define the aggregation pipeline
      // NOTE: You can test this pipeline in Realm's function editor, but to actually
      // use it from mongo and not here you need to install the Realm Web SDK and
      // use it like: const functionResponse = await app.functions.myRealmFunction('arg1', 'arg2');
      // This can be considered if application gets much larger and prefer to manage functions in mongo
      // Considerations include: source control, mongo billing structure

      const rankingObjectId = new ObjectId(rankingid);

      const agg = [
        {
          $match: {
            _id: rankingObjectId,
          },
        },
        {
          $unwind: {
            path: '$players',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'players.playerId',
            foreignField: '_id',
            as: 'players.player',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'players.challengerId',
            foreignField: '_id',
            as: 'players.challenger',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'owner_id',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $unwind: {
            path: '$players.player',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$players.challenger',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$owner',
          },
        },
        {
          $project: {
            name: 1,
            owner: {
              nickname: 1,
            },
            players: {
              player: {
                _id: 1,
                nickname: 1,
              },
              challenger: {
                _id: 1,
                nickname: 1,
              },
              rank: 1,

            },
          },
        },
        {
          $group: {
            _id: '$_id',
            owner_name: {
              $first: '$owner.nickname',
            },
            ranking: {
              $push: '$players',
            },
            player_count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: 'rankings',
            localField: '_id',
            foreignField: '_id',
            as: 'rankingDetails',
          },
        },
        {
          $unwind: {
            path: '$rankingDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            'rankingDetails.ranking': '$ranking',
            'rankingDetails.owner_name': '$owner_name',
            'rankingDetails.player_count': '$player_count',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$rankingDetails',
          },
        },
        {
          $unwind:
          /**
           * Provide any number of field/order pairs.
           */
          {
            path: '$ranking',
          },
        },
        {
          $sort:
          /**
           * Provide any number of field/order pairs.
           */
          {
            'ranking.rank': 1,
          },
        },
        {
          $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: '$_id',
            // Group the documents back by their original _id
            ranking: {
              $push: '$ranking',
            },
            // Push the sorted ranking objects back into an array
            // Use $first to select other fields you want to preserve
            active: {
              $first: '$active',
            },
            owner_id: {
              $first: '$owner_id',
            },
            owner_name: {
              $first: '$owner_name',
            },
            baseaddress: {
              $first: '$baseaddress',
            },
            name: {
              $first: '$name',
            },
            player_count: {
              $first: '$player_count',
            },
          },
        },
        {
          $project: {
            active: 1,
            owner_id: 1,
            owner_name: '$owner_name',
            baseaddress: 1,
            name: 1,
            ranking: 1,
            player_count: 1,
          },
        },
      ]
      console.log('ready to agg? with rankingid : ', rankingid)
      // Run the aggregation pipeline
      const result = await collection.aggregate(agg).toArray()

      // Process and print the results
      //await result.forEach((doc) => console.log(doc))
      return result
    } catch (error) {
      console.error('Error in searchIndex:', error)
      return null // Return a default value or null
    }
  }

  // REVIEW: Move to top? - Initialize the MongoDB client when the application starts
  initializeMongoClient()

  // Handle application shutdown
  process.on('SIGINT', async () => {
    try {
      console.log('Closing MongoDB client...')
      await client.close()
    } catch (error) {
      console.error('Error closing MongoDB client:', error)
    } finally {
      process.exit(0)
    }
  })

  // NOTE: Handle GET and POST according to req.method - req is the outgoing request
  //from this proxy, res is the response API sends back
  expressapp.all('/middleware', async (req, res) => {
    // Branch on method
    console.log('req.method top :', req.method)
    try {
      if (req.method == 'POST') {
        var post_header_params = {}
        const extractBaseUrl = req.body
        const { apiUrl } = extractBaseUrl


        const extractBodyData = req.body
        const {
          query_type,

          searchterm,
          rankingid,
        } = extractBodyData

        console.log('queryType', query_type)
        console.log('searchterm', searchterm)
        console.log('rankingid', rankingid)
        var responseToElm = {}


        //TODO: No need for formdata etc. we just want the search term
        if (query_type == 'search') {
          //const searchTerm = gotFormData(req);
          console.log('searchTerm received from gotFormData: ', searchterm)
          let errorOccurred = false

          try {
            const response = await searchIndex(searchterm)
            response.forEach((doc) => console.log(doc))
            const editedResponseData = { results: response }
            responseToElm = res.json(editedResponseData)
          } catch (error) {
            console.log('Error: ', error)
            errorOccurred = true
          }

          if (errorOccurred) {
            console.log('err in searchIndex')
          }
        } else if (query_type == 'fetch') {
          //NAV: Fetch result
          console.log('in fetch rankingid : ', rankingid)
          try {
            const response = await fetchRankingAsSpectator(rankingid)


            responseToElm = getFirstElement(response);
          } catch (error) {
            console.log('Error: ', error)
            errorOccurred = true
          }
        } else {
          console.log('err in the search/fetch if statement')
        }


        function getFirstElement(arr) {
          if (arr.length > 0) {
            return arr[0];
          } else {
            return undefined; // or you can return null, an empty string, or any other default value
          }
        }
        /* expressapp.get('*', (req, res) => {
          console.log('Request URL:', req.url);
          console.log( console.log('response :', res));
          res.sendFile(path.join(__dirname, '../js/elm.js', '../index.html'));
        }); */

        return res.json(responseToElm);

        // NOTE: If not a POST, must be a GET:
      } else {
        console.log('in GET : ')

        // Get the data from the querystring sent from Elm

        const { apiUrl } = req.query

        //NOTE: Unlike post, there is no , (form) data, arg here cos
        // using query params instead
        console.log('apiurl : ', apiUrl)
        console.log('headers : ', getHeaders(req))
        console.log('qparams : ', getQueryParams(req))

        // Create an axios instance(better for logging)
        const instance = axios.create()

        // Add a request interceptor for logging
        instance.interceptors.request.use((config) => {
          console.log('Request URL:', config.url)
          console.log('Request Method:', config.method)
          console.log('Request Headers:', config.headers)
          //There's no 'data' for GET like there is for POST
          return config
        })
        // NOTE: This is the only way to log the actual URL sent
        console.log(
          'Request URL:',
          `${apiUrl}?${new URLSearchParams(getQueryParams(req)).toString()}`,
        )

        // for the logging to work we've gone from axios.get to instance.get
        const response = await instance.get(apiUrl, {
          params: getQueryParams(req),
          headers: getHeaders(req),
        })

        /* expressapp.get('*', (req, res) => {
          console.log('Request URL:', req.url);
          console.log( console.log('response :', res));
          res.sendFile(path.join(__dirname, '../js/elm.js', '../index.html'));
        }); */
        res.json(response.data)

      }
    } catch (error) {
      if (error.response) {
        // Request was made and server responded with an error status
        console.log('Error response data: ', error.response.data) // Error response data
        console.log('Error status code: ', error.response.status) // Error status code
        console.log('Error response headers: ', error.response.headers) // Error response headers
      } else if (error.request) {
        console.log(
          'Request was made but no response was received: ',
          error.request,
        ) // The request object
      } else {
        console.log(
          'Error: Something else happened during the request: ',
          error.message,
        )
      }
    }
  })

  //Helper Functions:
  function getQueryParams(req) {
    var query_params = {}
    // NOTE: This list will represent ALL the possible values that could be sent through - each query will use different ones
    console.log('req', req.query)
    const { query_type, searchterm } = req.query
    console.log('query_type ', query_type)
    console.log('searchterm ', searchterm)
    // -- NOTE:  bookingsOauth only need to be run once ever to get the refresh token
    // from now on branch on bookingsRefreshToken and that is the first request on
    // reaching Bookings page.
    if (query_type === 'search') {
      console.log('inside search')
      query_params.search = searchterm
    } else {
      // Default case: query type not recognized
      console.log('getQueryParams - MongodbMW - Unknown query type!')
    }

    return query_params
  }

  // NOTE: headers, params and form data don't interfere with eachother:
  function getHeaders(req) {
    var header_params = {}
    // NOTE: This list will represent ALL the possible values that could be sent through - each query will use different ones
    //for zohoBaseUrl see above
    if (req.method == 'POST') {
      const { access_token, query_type } = req.body
      const oauthtoken = req.headers['authorization']
      if (query_type === 'book-appointment') {
        // -- NOTE: If token issue get 'INVALID_TICKET' error
        header_params.Authorization = oauthtoken
        header_params['Content-Type'] = 'multipart/form-data'
      } else {
        console.log('POST - No headers configuration')
      }
    } else {
      const { access_token, query_type } = req.query
      const oauthtoken = req.headers['authorization']
      if (query_type === 'bookingsAvailability') {
        header_params.Authorization = oauthtoken
      } else {
        console.log('GET - No headers configuration')
      }
    }

    return header_params
  }
}

main()
  .then(() => {
    const server = expressapp.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send(JSON.stringify({ message: message }));
      });

      ws.send(JSON.stringify({ message: 'Hello from websocket server' }));
    });

    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });
  })
  .catch(console.error);
