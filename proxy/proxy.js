const express = require("express");
const cors = require("cors");
const axios = require("axios");
const helmet = require("helmet");
const FormData = require("form-data");
const qs = require("qs");

/* -- NOTE: This is here for reference and development. It's used in the Namecheap 'proxy' directory on the server:

App URI:
<whatever domain name you buy from Namecheap>.com/

App root directory (using Squash Passion as e.g.):
/home/squastgr/public_html/proxy 

In this example, we are using the express library to create a new Node.js server and the cors middleware to allow cross-origin requests. 
We are also using the axios library to make HTTP requests to the third-party API server.

The server listens for requests on port 3000 and has a multiple routes that accepts a string of query 
or post parameters. When the Elm client sends a GET or POST request to the routes, this server makes a corresponding GET or POST 
request to the third-party API server with the same query or post parameters (once extracted here) and returns the response to the Elm client as a JSON object.



-- NOTE: Re-start the server on every change: node proxy.js (in /proxy terminal folder)

console.log('log here'); will log to the terminal, not the web console

-- NOTE: In the ordinary course of usage (not getting one off codes for new API Oauth) you start at the 
Refresh the Access Token stage (in Zoho's OAuth instructions)
which in the Elm code is referred to as requestAccessToken (or similar)
and here starts with gathering the POST data from Elm

*/

const expressapp = express();
const corsOptions = {
  origin: 'http://192.168.1.90:5500/schedule',
  methods: 'GET,POST,OPTIONS',
};

//expressapp.use(cors(corsOptions));
expressapp.use(cors());

// Middleware to parse JSON data in request body
expressapp.use(express.json());

// Allow requests from a specific origin
expressapp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// To clarify - req is the outgoing request from this proxy, res is the response API sends back
expressapp.all("/proxy", async (req, res) => {
  // Branch on method
  console.log("req.method top :", req.method);
  try {
    if (req.method == "POST") {
      var post_header_params = {};
      const extractBaseUrl = req.body;
      const { apiUrl } = extractBaseUrl;

      const data = gotFormData(req);

      // Create an axios instance
      const instance = axios.create();

      // Add a request interceptor for logging
      instance.interceptors.request.use((config) => {
        console.log("Request URL:", config.url);
        console.log("Request Method:", config.method);
        console.log("Request Headers:", config.headers);
        console.log("Request Data:", config.data);
        return config;
      });

      console.log(
        "Request URL:",
        `${apiUrl}?${new URLSearchParams(getQueryParams(req)).toString()}`
      );
      // for the logging to work we've gone from axios.post to instance.post
      //if (isFormDataReady(req)){
        const response = await instance.post(apiUrl, data, {
          headers: getHeaders(req),
        });
    //}
      console.log("Returned Data : ", response.data);
      //Capture the response from Zoho. This will be picked up by the Http.expect that
      //is part of the Http.request in Elm
      // -- REVIEW: How exactly?
      // Response is from API (Zoho), res is going back to Elm
      res.json(response.data);
      // NOTE: If not a POST, must be a GET:
    } else {
      console.log("in GET : ");

      // Get the data from the querystring sent from Elm

      const { apiUrl } = req.query;

      //NOTE: Unlike post, there is no , (form) data, arg here cos
      // using query params instead
      console.log("apiurl : ", apiUrl);
      console.log("headers : ", getHeaders(req));
      console.log("qparams : ", getQueryParams(req));

      // Create an axios instance(better for logging)
      const instance = axios.create();

      // Add a request interceptor for logging
      instance.interceptors.request.use((config) => {
        console.log("Request URL:", config.url);
        console.log("Request Method:", config.method);
        console.log("Request Headers:", config.headers);
        //There's no 'data' for GET like there is for POST
        return config;
      });
      // NOTE: This is the only way to log the actual URL sent
      console.log(
        "Request URL:",
        `${apiUrl}?${new URLSearchParams(getQueryParams(req)).toString()}`
      );

      // for the logging to work we've gone from axios.get to instance.get
      const response = await instance.get(apiUrl, {
        params: getQueryParams(req),
        headers: getHeaders(req),
      });
      //console.log('response data : ', response.data);

      /* tempResponseData = {
        response: {
          returnvalue: {
            reponse: true,
            data: [
              "13:30",
              "14:30",
              "15:30",
              "16:30",
              "17:30",
              "18:30",
              "19:30",
              "20:30",
            ],
            time_zone: "Asia/Singapore",
          },
          status: "success",
        },
      }; */
      res.json(response.data)
      //res.json(tempResponseData);
    }
  } catch (error) {
    if (error.response) {
      // Request was made and server responded with an error status
      console.log("Error response data: ", error.response.data); // Error response data
      console.log("Error status code: ", error.response.status); // Error status code
      console.log("Error response headers: ", error.response.headers); // Error response headers
    } else if (error.request) {
      console.log(
        "Request was made but no response was received: ",
        error.request
      ); // The request object
    } else {
      console.log(
        "Error: Something else happened during the request: ",
        error.message
      );
    }
  }
});

const PORT = process.env.PORT || 3000;
expressapp.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});

//Helper Functions:
function getQueryParams(req) {
  var query_params = {};
  // NOTE: This list will represent ALL the possible values that could be sent through - each query will use different ones
  //for zohoBaseUrl see above
  const { query_type, service_id, staff_id, selected_date } = req.query;

  // -- NOTE:  bookingsOauth only need to be run once ever to get the refresh token
  // from now on branch on bookingsRefreshToken and that is the first request on
  // reaching Bookings page.
  if (query_type === "bookingsAvailability") {
    console.log("inside bookingsAvailability");
    query_params.service_id = service_id;
    query_params.staff_id = staff_id;
    query_params.selected_date = selected_date;
  } else {
    // Default case: query type not recognized
    console.log("getQueryParams - Unknown query type!");
  }

  return query_params;
}

function gotFormData(req) {
  const extractBodyData = req.body;
  const {
    customer_password,
    grant_type,
    query_type,
    service_id,
    staff_id,
    from_time,
    customer_name,
    customer_email,
    customer_phone,
    condo_name,
    condo_address,
    additional_info,
  } = extractBodyData;

  console.log("Query type is ", query_type);

  const data = new FormData();

  if (query_type === "access-token") {
    // -- NOTE: Left side is the exact field name expected by the server, right side is the value from Elm
    data.append("grant_type", grant_type.trim());
    data.append("client_id", process.env.ZOHO_CLIENT_ID.trim());
    data.append("client_secret", process.env.ZOHO_CLIENT_SECRET.trim());
    data.append("refresh_token", process.env.ZOHO_REFRESH_TOKEN.trim());
  } else if (query_type === "user_login") {
    console.log('user login : ');
    data.append("customer_email", customer_password.trim());
    data.append("customer_password", customer_password.trim());
  } else if (query_type === "book-appointment") {
    //NOTE: all these fields (e.g. addInfo) must exist, using same format (case etc.) in Zoho, if not create them in the session's book form fields
    //Sessions -> Session Booking Form -> Fields
    data.append("service_id", service_id.trim());
    data.append("staff_id", staff_id.trim());
    data.append("from_time", from_time.trim());
    data.append(
      "customer_details",
      JSON.stringify({
        name: customer_name.trim(),
        email: customer_email.trim(),
        phone_number: customer_phone.trim(),
      })
    );
    data.append(
      "additional_fields",
      JSON.stringify({
        condoName: condo_name,
        condoAddress: condo_address,
        addInfo: additional_info,
      })
    );
  } else {
    console.log("gotFormData - Unknown query type!");
  }

  return data;
}

// NOTE: headers, params and form data don't interfere with eachother:
function getHeaders(req) {
  var header_params = {};
  // NOTE: This list will represent ALL the possible values that could be sent through - each query will use different ones
  //for zohoBaseUrl see above
  if (req.method == "POST") {
    const { access_token, query_type } = req.body;
    const oauthtoken = req.headers["authorization"];
    if (query_type === "book-appointment") {
      // -- NOTE: If token issue get 'INVALID_TICKET' error
      header_params.Authorization = oauthtoken;
      header_params["Content-Type"] = "multipart/form-data";
    } else {
      console.log("POST - No headers configuration");
    }
  } else {
    const { access_token, query_type } = req.query;
    const oauthtoken = req.headers["authorization"];
    if (query_type === "bookingsAvailability") {
      header_params.Authorization = oauthtoken;
    } else {
      console.log("GET - No headers configuration");
    }
  }

  return header_params;
}

// -- REVIEW: might not need:
function isFormDataReady(req) {
  //if (frmData.entries().next().done) {
  // Use timezone to check if FormData has any values
  if (req.query.timezone === undefined) {
    // FormData is empty, handle the case
    console.log("No form data to send");
    // NOTE: Do nothing - not ready to send form data
    return false;
  } else {
    console.log("returning true for form data : ");
    return true;
  }
}
