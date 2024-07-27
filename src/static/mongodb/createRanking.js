// NOTE:  gets called from iniitalizeMongo.js
// NOTE: for debugging use de-bugger, not Console.log

// NOTE: This will trigger 'insertRankingIdIntoOwnerOfArrayFunc' in mongodb
// so that the user doc will have the new ranking inserted into the ownerOf array


async function createRanking(rankingname, street, city) {
  try {
    
      const newRanking = await sendNewRankingToDB(rankingname, street, city);

      // REVIEW: This is turned off for now, until can ensure can get a useable 
      // ranking id to work with the aggregate function
      if (newRanking) {
        
        await sendNewlyCreatedRankingResponseToElmPort(newRanking, 'CreatedNewRanking');
      } else {
        console.error('Failed to create a new ranking.');
      }
    
  } catch (error) {
    console.error('Error: ', error);
  }
}


async function sendNewRankingToDB(rankingname, street, city) {
  //NOTE: these consts must be initialized inside this function's scope:
  // REVIEW: user globalUser here?
  const mongo = globalUser.mongoClient("mongodb-atlas");
  const rankings = mongo.db("sportrank").collection("rankings");
  // RF: JS date create not currently accepted by mongo:
  //var createdDt = new Date();

  try {
    // NOTE: This is registering the new ranking on mongo:
    // REVIEW: These fields are also set in Elm
    const newranking = await rankings.insertOne({
      active: true,
      name: rankingname,
      players: [
        {
          playerId: Realm.BSON.ObjectId(globalUser.id),
          //challenger defaults to No Challenger:
          challengerId: Realm.BSON.ObjectId(noChallengerCurrentlyId) ,
          rank: 1,
          
        },
      ],
      owner_id: Realm.BSON.ObjectId(globalUser.id),
      baseaddress: {
        street: street,
        city: city,
      },
    });
    return newranking;
  } catch (err) {
    console.error("Caught error : ", err);
  }
}

async function sendNewlyCreatedRankingResponseToElmPort(rankingData, operationEvent) {
  //NOTE: Notes in register.js
  console.log('rankingData in sendNewlyCreatedRankingResponseToElmPort', rankingData);

  //NOTE: We're extracting the key data we need immediately from the rankingData object
  // but also sending the whole object through to Elm so that it can be used later if needed
  //const additionalDataObjExtendibleIfRequired = {userid : rankingData._id, nickname : rankingData.nickname};
  additionalDataObjExtendibleIfRequired = { userid: '', nickname: '' }
  jsonMsgToElm = {
    operationEventMsg: operationEvent,
    //NOTE: dataFromMongo is what we originally sent to Elm alone
    // Now it is sent with these other fields for added context
    dataFromMongo: rankingData,
    
    //NOTE: Each 'additionalDataFromJs' will have it's own decoder in Elm 
    // Which decoder will be determined by the 'msg' type above
    additionalDataFromJs: additionalDataObjExtendibleIfRequired,
  }

  // NOTE: Send data TO Elm
  eapp.ports.messageReceiver.send(jsonMsgToElm)
}

//NOTE: Once we've added the new ranking to the db we can query it as a verification
// using the initial response from 'insertOne':


// RF: Local Storage code, if there is a way to bypass user re-login above:
/* 
// Extract the stored data from previous sessions (Elm not involved)
// nb. something has to have been set in localStorage first:
var storedData = localStorage.getItem('myapp-storage');

// Listen for commands from the `setStorage` port in Elm.
// Turn the data to a string and put it in local or sessionStorage.
app.ports.setStorage.subscribe(function(state) {
  localStorage.setItem('myapp-storage', JSON.stringify(state));
  //sessionStorage.setItem('myapp-storage', JSON.stringify(state));
});
 */