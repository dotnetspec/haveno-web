//REVIEW: Just fetchedRanking?:
//REVIEW: Can this js be simplified?:
function fetchedRanking(rankingid, rankingType) {
  (async function () {
    try {
      if (rankingType == 'spectatorranking') {console.log ('handle spectatorranking in Elm, not here')}else{
        const rankingdataobj = await queryfetchedRankingToElmPort(rankingid, rankingType)
         // NOTE: Send data TO Elm
        sendRankingToElmPort(rankingdataobj, rankingType);
      }
    } catch (err) {
      console.error("Failed to fetchedRankingMDB", err);

      errMsgToElm = {
        err: "Problem recieving data for this ranking"
        
      };
      eapp.ports.messageReceiver.send(errMsgToElm);
    }
  })();
}

//NOTE: Strings in Elm are converted to ObjectIds for mongo:
function cleanupEachRankingObjForElmPort(rankingArr) {
  rankingArr.forEach(cleanEachRankingObj);
  return rankingArr;
}

//NOTE: No need for a return value in this function
//REVIEW: We now expect all challengers to be user - ObjectId('noChallengerCurrentlyId').
// There is nothing in this .js to check against null or undefined values currently.
//WARN: All ObjectId from db must be toString ed in js, so the decoder can decode (D.string) in Elm

function cleanEachRankingObj(item, index, arr) {
  arr[index] = {
    rank: item.rank,
    
    player: {
      _id: Realm.BSON.ObjectId(item.player._id).toString(),
      nickname: item.player.nickname,
    },
    challenger: {
      _id: Realm.BSON.ObjectId(item.challenger._id).toString(),
      nickname: item.challenger.nickname,
    },
  };
}

async function queryfetchedRankingToElmPort(rankingid, rankingType) {
  //WARN: Ensure the globalUser has been initialized
  const user = globalUser.mongoClient("mongodb-atlas");
  const rankings = user.db("sportrank").collection("rankings");
  const checkedRankingId = ensureContainsOnlyAlphaNumeric(rankingid);

  const rankingData = await rankings.aggregate(
    //WARN: You must 'export to language' My Pipeline in the UI for to ensure correct formatting e.g. $match, not '$match' etc.
    //NOTE: for new pipeline to add to the Atlas aggregation UI from text copy from arrary start here:
    [
      {
        $match: {
          _id: Realm.BSON.ObjectId(checkedRankingId),
        },
      },
      {
        $unwind: {
          path: "$players",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "players.playerId",
          foreignField: "_id",
          as: "players.player",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "players.challengerId",
          foreignField: "_id",
          as: "players.challenger",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$players.player",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$players.challenger",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$owner",
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
          _id: "$_id",
          owner_name: {
            $first: "$owner.nickname",
          },
          ranking: {
            $push: "$players",
          },
          player_count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "rankings",
          localField: "_id",
          foreignField: "_id",
          as: "rankingDetails",
        },
      },
      {
        $unwind: {
          path: "$rankingDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "rankingDetails.ranking": "$ranking",
          "rankingDetails.owner_name": "$owner_name",
          "rankingDetails.player_count": "$player_count",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$rankingDetails",
        },
      },
      {
        $unwind:
          /**
           * Provide any number of field/order pairs.
           */
          {
            path: "$ranking",
          },
      },
      {
        $sort:
          /**
           * Provide any number of field/order pairs.
           */
          {
            "ranking.rank": 1,
          },
      },
      {
        $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: "$_id",
            // Group the documents back by their original _id
            ranking: {
              $push: "$ranking",
            },
            // Push the sorted ranking objects back into an array
            // Use $first to select other fields you want to preserve
            active: {
              $first: "$active",
            },
            owner_id: {
              $first: "$owner_id",
            },
            owner_name: {
              $first: "$owner_name",
            },
            baseaddress: {
              $first: "$baseaddress",
            },
            name: {
              $first: "$name",
            },
            player_count: {
              $first: "$player_count",
            },
          },
      },
      {
        $project: {
          active: 1,
          owner_id: 1,
          owner_name: "$owner_name",
          baseaddress: 1,
          name: 1,
          ranking: 1,
          player_count: 1,
        },
      },
    ]
    //NOTE: array ends
  );

  //NOTE: ObjectIds in mongo are converted to strings for Elm:
  //NOTE: You don't need to JSON.stringify before you send to Elm:
  //WARN: breaks in field names e.g. base address or base_address can
  //sometimes cause field to not recogized - I don't know why.
  //HACK: using toString on ObjectId fields to get around ObjectId decoding (D.string):

  const rankingDataObj = {
    _id: rankingData[0]._id.toString(),
    owner_name: rankingData[0].owner_name,
    owner_id: rankingData[0].owner_id.toString(),
    player_count: rankingData[0].player_count,
    active: rankingData[0].active,
    baseaddress: {
      street: rankingData[0].baseaddress.street,
      city: rankingData[0].baseaddress.city,
    },
    name: rankingData[0].name,
    ranking: cleanupEachRankingObjForElmPort(rankingData[0].ranking),
    
  };

 return rankingDataObj;
}

async function sendRankingToElmPort(rankingData, operationEvent) {
  //NOTE: Notes in register.js
  additionalDataObjExtendibleIfRequired = { userid: '', nickname: '' }
  jsonMsgToElm = {
    //operationEvent will be ownedranking or memberanking
    operationEventMsg: operationEvent,
    dataFromMongo: rankingData,
    
    additionalDataFromJs: additionalDataObjExtendibleIfRequired,
  }

  // NOTE: Send data TO Elm
  eapp.ports.messageReceiver.send(jsonMsgToElm)
}


