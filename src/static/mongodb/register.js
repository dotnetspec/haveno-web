// NOTE: Create the new user and then fetch it in a separate function.

// NOTE: register gets called from iniitalizeMongo.js
function register(email, password, nickname) {
  ;(async function () {
    const newuser = await registerNewUser(email, password)
    //REVIEW: This adds a lot of overhead, but it's the only way I can currently
    // get the user data in the a document in the users collection
    const userInserted = await sendUserRegistrationDetailsToDB(
      newuser,
      nickname,
    )
    //NOTE: sendUserRegistrationDetailsResponseToElmPort is the original code that sends the user data to Elm. But cos in js
    // is relatively brittle. We now use the obj in sendCreatedNewUserConfirmToElmPort
    //await sendUserRegistrationDetailsResponseToElmPort(newuser, email);
    await sendCreatedNewUserConfirmToElmPort(userInserted, newuser.id, nickname)
    console.log('Successfully registered new user!', newuser.id)
  })()
}

async function registerNewUser(email, password) {
  try {
    //NOTE: invoke registerUser from realmapp to register new user in mongodb realm
    //(bypassing 'pending' in mongo)
    // Register the user with emailPasswordAuth authentication (other authentication options in docs)
    await realmapp.emailPasswordAuth.registerUser({ email, password })
    //Immediately login the new user (to go past 'pending' in realm console)
    const newUsercredentials = Realm.Credentials.emailPassword(email, password)
    const loggedInNewUser = await realmapp.logIn(newUsercredentials)

    // -- NOTE: Setting the globalUser declared in initialize.js
    // so that is can be used throughout the functions (e.g. deleteUser immediately after register)
    globalUser = loggedInNewUser

    //assign refreshToken to session storage so that realm can access it
    sessionStorage.setItem(
      'realm-web:app(sr-espa1-snonq):user(' +
        loggedInNewUser.id +
        '):refreshToken:',
      loggedInNewUser.refreshToken,
    )
    // RF: if you figure out how to pass authEvent in as an arg can utilize it here:
    // const { user, time } = authEvent;
    // const newUser = { ...user, eventLog: [ { "created": time } ] };
    // `App.currentUser` updates to match the logged in newuser - only logs in console if false
    // this was in original code, not sure why:
    console.assert(loggedInNewUser.id === realmapp.currentUser.id)
    return loggedInNewUser
  } catch (err) {
    console.error('Failed to log in', err)
  }
}

async function sendUserRegistrationDetailsToDB(user, nickname) {
  //NOTE: these consts must be initialized inside this function's scope:
  const mongo = user.mongoClient('mongodb-atlas')
  const users = mongo.db('sportrank').collection('users')
  // RF: JS date create not currently accepted by mongo:
  var createdDt = new Date()
  // REF: mongodb-documentation.readthedocs.io/en/latest/ecosystem/tools/http-interfaces.html#gsc.tab=0
  // try - "date" : { "$date" : 1250609897802 }

  try {
    // NOTE: This is registering the new user on mongo.
    // NOTE: Any fields added here must be decoded in Elm
    const insertedUser = await users.insertOne({
      _id: Realm.BSON.ObjectId(user.id),
      active: true,
      description: { level: '', comment: '' },
      datestamp: 100,
      token: '1234',
      updatetext: '',
      mobile: '',
      credits: 20,
      
      // NOTE: we don't use password here, but we need the field
      // in userInfo to manage password updates
      // I think if we don't add it here won't make any difference(?)
      //password: "",
      // REVIEW: It should be possible to obtain email from mongo
      // w/o having a separate field in the user document
      // email: "",
      nickname: nickname,
      ownerOf: [],
      memberOf: [],
      addInfo: '',
      gender: 'Male',
      age: 0,
    })

    return insertedUser
  } catch (err) {
    console.error('Caught error : ', err)
  }
}

async function sendUserRegistrationDetailsResponseToElmPort(user, email) {
  try {
    //NOTE: these consts must be initialized inside this function's scope:
    const mongo = user.mongoClient('mongodb-atlas')
    const users = mongo.db('sportrank').collection('users')

    //try {
    const userData = await runPipeline(users, user) // replace with your function to run the pipeline
    if (userData.length > 0) {
      console.log(userData[0])
      //NOTE: ObjectIds in mongo are converted to strings for Elm:
      //NOTE: You don't need to JSON.stringify before you send to Elm:
      //HACK: using toString on some fields to get around Realm.BSON.ObjectId decoding
      //although haven't done that here and instead work with the values as
      // a string in Elm
      //NOTE: This will be sent to Elm via port:

      console.log('user data : ', userData)

      const userDataObj = {
        _id: userData[0]._id,
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
        //REVIEW: This is just the email the user typed in
        email: email,
        nickname: userData[0].nickname,
        ownedRankings: cleanupEachObjForElmPort(userData[0].ownedRankings),
        memberRankings: cleanupEachObjForElmPort(userData[0].memberRankings),
        addInfo: userData[0].addInfo,
        gender: userData[0].gender,
        age: userData[0].age,
        
      }

      // NOTE: Receive response from Mongodb and Send data TO Elm
      eapp.ports.messageReceiver.send(userDataObj)
    } else {
      console.log('No data returned')
    }
  } catch (err) {
    console.error('Caught error : ', err)
  }
}

async function runPipeline(users, user) {
  const userData = await users.aggregate(
    //NOTE: for new pipeline from text copy from arrary start here (I think this refers to mongodb where build queries in the UI):
    // NOTE: this pipeline has been edited beyond the original adding new fields to match full userInfo
    [
      {
        $match: {
          //REVIEW: This currently makes no sense to me, but it works. I do not understand why this is not Realm.BSON.ObjectId(user.userid):
          userid: Realm.BSON.ObjectId(user.id),
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
          addInfo: 1,
          gender: 1,
          age: 1,
          ownedRankings: {
            _id: 1,
            name: 1,
          },
          memberRankings: {
            _id: 1,
            name: 1,
          },
          owner_ranking_count: 1,
          member_ranking_count: 1,
          owner_ranking_count: {
            $size: '$ownedRankings',
          },
          member_ranking_count: {
            $size: '$memberRankings',
          },
        },
      },
    ],
    //NOTE: array ends
  )
  return userData
}

// NOTE: Sending an object to Elm gives us more control over the data and enables
// relevant msg and operationEvent etc. to be sent to Elm. The json is sent as a string
// so that it can be decoded in Elm, not here in js where it is less reliable/flexible.
async function sendCreatedNewUserConfirmToElmPort(
  newUserMongoDBData,
  newuserid,
  nickname,
) {
  // REVIEW: You may decide what to do with newUserMongoDBData but for now just send simple json msg
  // to Elm, which will be available in the rankings.model

  //NOTE: JSON.stringify secures the reliability of the data sent to Elm as Json format but it adds escape chars
  // etc. These are removed in Elm with Json.Decode.decodeString (removeExtraEscapeCharsEtcFromJsonStringifiedDataFromJs)

  //NOTE: If you JSON.stringify always send objects to Elm so that you can handle the data. e.g. Just a string
  // has to have decoder etc. Now we can send as a object and handle the data in Elm.

  //NOTE: This obj can be changed to send any data to Elm via additionalDataFromJs
  //eg. biggerObjContainingAnotherFieldWeNowNeed = { userid: newuserid, nickname: nickname, newfield: newfield }
  //NOTE: It will be necessary to update the relevant decoder in Elm to handle the new field
  // and ALL the .js modules as they all send additionalDataFromJs to Elm
  additionalDataObjExtendibleIfRequired = { userid: newuserid, nickname: nickname }

  jsonMsgToElm = {
    operationEventMsg: 'NewUserCreationComplete',
    //NOTE: newUserMongoDBData is still a .js obj here. However, Elm knows how to
    // decode it as a JSON string, so no need to JSON.stringify it here.
    // Any problems and may be necessary to JSON.stringify here JSON.stringify(newUserMongoDBData).
    dataFromMongo: newUserMongoDBData,
    
    additionalDataFromJs: additionalDataObjExtendibleIfRequired, //JSON.stringify(nickname)
  }

  // NOTE: Send data TO Elm
  eapp.ports.messageReceiver.send(jsonMsgToElm)
}
