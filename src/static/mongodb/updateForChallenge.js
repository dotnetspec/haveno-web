async function updateForChallenge(rankingid, playerid, challengerid, rank) {
  try {
    //WARN: Ensure the globalUser has been initialized
    const user = globalUser.mongoClient("mongodb-atlas");
    const rankings = user.db("sportrank").collection("rankings");
    //const checkedRankingId = ensureContainsOnlyAlphaNumeric(rankingid)
    const result = await updateForChallengeToDB(
      rankings,
      rankingid,
      playerid,
      challengerid,
      rank
    );
    //await updateForChallengeToElmPort(result);
  } catch (err) {
    console.error("Failed to updateForChallenge", err);

    errMsgToElm = {
      err: "Problem recieving data for this challenge"
    
    };
    eapp.ports.messageReceiver.send(errMsgToElm);
  }
}

// NOTE: The challengerid will also be the current user id as always challenge up
//playerid should be the (higher) player who is being challenged
async function updateForChallengeToDB(
  rankings,
  rankingid,
  playerid,
  challengerid,
  rank
) {
  //WARN: Ensure the globalUser has been initialized
  /* const user = globalUser.mongoClient('mongodb-atlas')
    const rankings = user.db('sportrank').collection('rankings')
    const checkedRankingId = ensureContainsOnlyAlphaNumeric(rankingid) */

  const rankingData = await rankings.updateOne(
    { _id: Realm.BSON.ObjectId(rankingid) },
    {
      $set: {
        //WARN: The current player is the challenger. This can be confusing.
        //NOTE: We can only challenge UP. So the challenger is always the current user (playerid)
        "players.$[elem].playerId": Realm.BSON.ObjectId(challengerid),
        "players.$[elem].challengerId": Realm.BSON.ObjectId(playerid),
        
        "players.$[elem2].playerId": Realm.BSON.ObjectId(playerid),
        "players.$[elem2].challengerId": Realm.BSON.ObjectId(challengerid),
        
      },
    },
    {
      arrayFilters: [
        { "elem.rank": parseInt(rank, 10) },
        { "elem2.rank": parseInt(rank, 10) + 1 },
      ],
    }
  );
  return rankingData;
}

// NOTE: The challengerid will also be the current user id as always challenge up
//playerid should be the (higher) player who is being challenged
async function updateForChallengeToElmPort(newMongoDBData) {

  additionalDataObjExtendibleIfRequired = { userid: newuserid, nickname: nickname }

  jsonMsgToElm = {
    operationEventMsg: 'UpdateForChallengeComplete',
    //NOTE: newUserMongoDBData is still a .js obj here. However, Elm knows how to
    // decode it as a JSON string, so no need to JSON.stringify it here.
    // Any problems and may be necessary to JSON.stringify here JSON.stringify(newUserMongoDBData).
    dataFromMongo: newMongoDBData,
    
    additionalDataFromJs: additionalDataObjExtendibleIfRequired, //JSON.stringify(nickname)
  }

  // NOTE: Send data TO Elm
  eapp.ports.messageReceiver.send(jsonMsgToElm);
}
