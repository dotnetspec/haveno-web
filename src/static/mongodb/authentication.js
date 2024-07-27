//NOTE: getting the mongodb 'realm-web' code online from a CDN (not from node_modules (currenlty don't know how to import otherwise))
//import * as Realm from "../../node_modules/realm-web";

//NOTE: this is called from initializeMongo.js:
async function login(email, password) {
  //invoke loginEmailPassword from authentication.js to login to mongodb realm
  console.log('in login function in authentication.js, password is ', password, 'email is ', email);
  
  {
    try {
      const user = await loginEmailPassword(email, password)
      if (user != undefined) {
        const userAfterCreation = await queryDBforUserToConfirmCreation(user, email)
        //NOTE: sendLoginConfirmToElmPort is the new confirm code, but keeping above as reliable to date
        sendLoginConfirmToElmPort(userAfterCreation, 'LOGINCONFIRM')
      } else {
        //console.error('Username/password not found')
        sendLoginConfirmToElmPort(user, 'LOGINDENIED')
      }
    } catch (err) {
      console.error('User not found. Failed to log in')//, err)
    }
  }
}

async function loginEmailPassword(email, password) {
  try {
    const credentials = Realm.Credentials.emailPassword(email, password)

    /* NOTE: Now we're using the realm-web module referenced in index.html. This is the ONLY way to work with mongodb and realm via
    a web browser (middleware is different, it can import modules etc.)  
    
    Our instantiated instance is realmapp. AFAIK, we can only use the functionality available via realmapp*/

    // Authenticate the user with realmapp
    if (credentials != undefined) {
      const user = await realmapp.logIn(credentials)

      // -- NOTE: Setting the globalUser declared in initialize.js
      // so that is can be used throughout the functions
      globalUser = user
      // `App.currentUser` updates to match the logged in user - only logs in console if false
      console.assert(user.id === realmapp.currentUser.id)
      return user
    } else {
      return undefined
    }
  } catch (err) {
    console.error('Failed to log in')//, err)
  }
}

async function logOut() {
  const user = realmapp.currentUser
  console.log('in logout', user)
  try {
    user
      .logOut()
      .then(() => {
        console.log('User logged out successfully')
      })
      .catch((err) => console.error('Failed to log out:', err))
  } catch {
    console.log('Null user. Already logged out?')
  }
}

//NOTE: Strings in Elm are converted to ObjectIds for mongo:
function cleanupEachObjForElmPort(rankingsArr) {
  rankingsArr.forEach(cleanEachObj)
  return rankingsArr
}
//parseInt(item.player_count, 10),
//NOTE: No need for a return value in this function
//NOTE: Every new value in a rankings array needs to be added here as well

function cleanEachObj(item, index, arr) {
  //console.log ('player count ' , parseInt(item.player_count, 10))
  // HACK: Some fields hard coded for now
  arr[index] = {
    // NOTE: Using the full reference for ObjectId to remind that we're using realm-web
    // for all our functionality
    _id: Realm.BSON.ObjectId(item._id).toString(),
    name: item.name,
    owner_name: item.owner_name,
    player_count: 1,
    baseaddress: item.baseaddress,
    active: item.active,
    owner_id: Realm.BSON.ObjectId(item.owner_id).toString(),
    ranking: [],
  }
}

async function queryDBforUserToConfirmCreation(user, email) {
  const mongo = user.mongoClient('mongodb-atlas')

  const users = mongo.db('sportrank').collection('users')
  console.log('user is ', user)
  //NOTE: If there is a problem with the 'aggregate' function (preferred) possible to use this with the CDN:
  //const userData = await users.findOne({ userid: ObjectId(user.id) });

  try {
    const userData = await runPipeline(users, user) // replace with your function to run the pipeline
    if (userData.length > 0) {
      console.log(userData[0])
      //NOTE: ObjectIds in mongo are converted to strings for Elm:
      //NOTE: You don't need to JSON.stringify before you send to Elm:
      //HACK: using toString on some fields to get around ObjectId decoding
      //although haven't done that here and instead work with the values as
      // a string in Elm
      //NOTE: This will be sent to Elm via port:

      console.log('user data : ', userData)

      const userDataObj = {
        _id: Realm.BSON.ObjectId(userData[0]._id).toString(),
        active: userData[0].active,
        description: {
          level: userData[0].description.level,
          comment: userData[0].description.comment,
        },
        datestamp: userData[0].datestamp,
        token: userData[0].token,
        updatetext: userData[0].updatetext,
        mobile: userData[0].mobile,
        credits: userData[0].credits,
        //NOTE: Don't care about pword once we're logged in:
        password: '',
        email: email,
        nickname: userData[0].nickname,
        ownedRankings: cleanupEachObjForElmPort(userData[0].ownedRankings),
        memberRankings: cleanupEachObjForElmPort(userData[0].memberRankings),
        addInfo: userData[0].addInfo,
        gender: userData[0].gender,
        age: userData[0].age,
        
      }

      // NOTE: Receive response from Mongodb and Send data TO Elm
      //eapp.ports.messageReceiver.send(userDataObj)
      return userDataObj;
    } else {
      console.log('No data returned')
    }
  } catch (err) {
    console.error('Error running pipeline:', err)
  }
}

async function runPipeline(users, user) {
  const userData = await users.aggregate(
    // NOTE: Get pipelines from sr-espa1-backend
    //NOTE: for new pipeline from text copy from arrary start here (I think this refers to mongodb where build queries in the UI):
    // NOTE: this pipeline has been edited beyond the original adding new fields to match full userInfo
    [
      {
        $match: {
          /* -- NOTE: Error: 'userData[0] is undefined'
        Users db -> userid ObjectId 
        REF: https://cloud.mongodb.com/v2/62c2926accd1a85c9abe4c0d#/metrics/replicaSet/62c2a81f0f73d81aaef1fed2/explorer/sportrank/users/find 
        must match this userid */
          //REVIEW: This is the user.id from Realm/App Users/Users email/id listings:
          // NOTE: Just use ObjectId(user.id) when reviewing the mongoDB pipeline
          _id: Realm.BSON.ObjectId(user.id),
        },
      },
      {
        $lookup: {
          from: 'rankings',
          localField: 'ownerOf',
          foreignField: '_id',
          as: 'ownedRankings',
        },
      },
      {
        $lookup: {
          from: 'rankings',
          localField: 'memberOf',
          foreignField: '_id',
          as: 'memberRankings',
        },
      },
      {
        $lookup: {
          from: 'users', // Assuming the owners' details are in the "users" collection
          localField: 'memberRankings.owner_id', // Adjust this field based on your data structure
          foreignField: '_id',
          as: 'memberRankingsWithOwnerName',
        },
      },
      {
        $project: {
          _id: 1,
          userid: 1,
          nickname: 1,
          active: 1,
          description: 1,
          datestamp: 1,
          token: 1,
          updatetext: 1,
          mobile: 1,
          credits: 1,
          ownedRankings: {
            _id: 1,
            active: 1,
            owner_id: 1,
            baseaddress: 1,
            ranking: 1,
            player_count: 1,
            name: 1,
            owner_name: '$nickname',
          },
          memberRankings: {
            _id: 1,
            name: 1,
            active: 1,
            owner_id: 1,
            baseaddress: 1,
            ranking: 1,
            player_count: 1,
            owner_name: {
              $arrayElemAt: ['$memberRankingsWithOwnerName.nickname', 0],
            },
          },
          owner_ranking_count: 1,
          member_ranking_count: 1,
          owner_ranking_count: {
            $size: '$ownedRankings',
          },
          member_ranking_count: {
            $size: '$memberRankings',
          },
          addInfo: 1,
          gender: 1,
          age: 1,
        },
      },
    ],
    //NOTE: array ends
  )
  return userData
}

async function sendLoginConfirmToElmPort(userData, operationEvent) {
  //NOTE: Notes in register.js
  console.log('userData in sendLoginConfirmToElmPort', userData);

  //NOTE: We're extracting the key data we need immediately from the userData object
  // but also sending the whole object through to Elm so that it can be used later if needed
  //const additionalDataObjExtendibleIfRequired = {userid : userData._id, nickname : userData.nickname};
  additionalDataObjExtendibleIfRequired = { userid: '', nickname: '' }

  jsonMsgToElm = {
    operationEventMsg: operationEvent,
    //NOTE: dataFromMongo is what we originally sent to Elm alone
    // Now it is sent with these other fields for added context
    dataFromMongo: userData,
    
    //NOTE: Each 'additionalDataFromJs' will have it's own decoder in Elm 
    // Which decoder will be determined by the 'msg' type above
    additionalDataFromJs: additionalDataObjExtendibleIfRequired,
  }

  // NOTE: Send data TO Elm
  eapp.ports.messageReceiver.send(jsonMsgToElm)
}
