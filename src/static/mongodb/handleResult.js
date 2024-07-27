async function handleResult(rankingid, playerid, challengerid, rank) {
  try {
    const updatedRankingData = await resetChallengeToElmPort(rankingid, playerid, challengerid, rank);
    await handleResultoElmPort(updatedRankingData);
  } catch (err) {
    console.error("Failed to updateForChallenge", err);

    errMsgToElm = {
      err: "Problem recieving data for this challenge"
      
    };
    eapp.ports.messageReceiver.send(errMsgToElm);
  }
}

// NOTE: Determination of who is now player or challenger is made in Elm
async function resetChallengeToElmPort(
  rankingid,
  playerid,
  challengerid,
  rank
) {
  //WARN: Ensure the globalUser has been initialized
  const user = globalUser.mongoClient("mongodb-atlas");
  const rankings = user.db("sportrank").collection("rankings");
  var checkedRankingId;
  try {
    checkedRankingId = ensureContainsOnlyAlphaNumeric(rankingid);
  } catch (error) {
    console.error("Failed to checkedRankingId", err);
  }

  // TODO: This is currently for update:
  const rankingData = await rankings.updateOne(
    { _id: Realm.BSON.ObjectId(checkedRankingId) },
    {
      $set: {
        players: [
          {
            playerId: Realm.BSON.ObjectId(playerid),
            challengerId: Realm.BSON.ObjectId(noChallengerCurrentlyId),
            rank: parseInt(rank, 10),
            
          },
          {
            playerId: Realm.BSON.ObjectId(challengerid),
            challengerId: Realm.BSON.ObjectId(noChallengerCurrentlyId),
            rank: parseInt(rank, 10) + 1,
            
          },
        ],
      },
    }
  );

  return rankingData;
}

// NOTE: The challengerid will also be the current user id as always challenge up
//playerid should be the (higher) player who is being challenged
async function handleResultoElmPort(newMongoDBData) {

  additionalDataObjExtendibleIfRequired = { userid: '', nickname: '' }

  jsonMsgToElm = {
    operationEventMsg: 'ResultSubmitted',
    //NOTE: newUserMongoDBData is still a .js obj here. However, Elm knows how to
    // decode it as JSON and, ultimately, to obtain the data within e.g. strings etc., so no need to JSON.stringify it here.
    // Any problems and may be necessary to JSON.stringify here JSON.stringify(newUserMongoDBData).
    dataFromMongo: newMongoDBData,
    
    additionalDataFromJs: additionalDataObjExtendibleIfRequired, //JSON.stringify(nickname)
  }

  // NOTE: Send data TO Elm
  eapp.ports.messageReceiver.send(jsonMsgToElm);
}