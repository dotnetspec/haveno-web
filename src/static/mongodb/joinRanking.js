// NOTE:  gets called from iniitalizeMongo.js
// NOTE: for debugging use de-bugger, not Console.log

// NOTE: This will trigger 'insertRankingIdIntoMemberOfArrayFunc' in mongodb
// so that the user doc will have the new ranking inserted into the memberOf array
//REVIEW: Might handle more of the logic for this in Elm, and send as an 'updateUser'
// similar to leaveRanking approach.

async function joinRanking(rankingid, userid, rank) {
  try {
    const joinedRanking = await sendRankingWantToJoinToDB(
      rankingid,
      userid,
      rank,
    )

    // REVIEW: We're sending the DB response straight to Elm (no pipeline etc.)
    if (joinedRanking) {
      try {
        await sendJoinRankingToPort(joinedRanking, 'JoinedRankingConfirm')
      } catch (error) {
        console.error('Error with sendJoinRankingToPort: ', error)
      }
    } else {
      console.error(
        'Failed to send new ranking back to Elm via port. It has probably been created in mongodb',
      )
    }
  } catch (error) {
    console.error('Error: ', error)
  }
}

async function sendRankingWantToJoinToDB(rankingid, userid, rank) {
  //NOTE: these consts must be initialized inside this function's scope:
  // REVIEW: user globalUser here?
  const mongo = globalUser.mongoClient('mongodb-atlas')
  const rankings = mongo.db('sportrank').collection('rankings')
  // RF: JS date create not currently accepted by mongo:
  //var createdDt = new Date();

  try {
    // NOTE: This is adding a player to the ranking in mongo:
    // REVIEW: These fields are handled in Elm e.g. last rank
    const updatedRanking = await rankings.findOneAndUpdate(
      { _id: Realm.BSON.ObjectId(rankingid) },
      {
        $push: {
          players: {
            playerId: Realm.BSON.ObjectId(userid),
            challengerId: Realm.BSON.ObjectId(noChallengerCurrentlyId),
            rank: parseInt(rank, 10),
          },
        },
        $set: {
          lastUpdatedBy: Realm.BSON.ObjectId(userid),
        },
      },
      { returnOriginal: false },
    )

    return updatedRanking
  } catch (error) {
    console.error('Error: ', error)
  }
}

//NOTE: Once we've added the new ranking to the db we can query it as a verification
// using the initial response from 'insertOne':
async function sendNewRankingResponseToElmPort(ranking) {
  try {
    //NOTE: these consts must be initialized inside this function's scope:
    const mongo = globalUser.mongoClient('mongodb-atlas')
    const rankings = mongo.db('sportrank').collection('rankings')
    const rankingData = await runPipeline(rankings, ranking)

    //NOTE: This takes the response from mongo and transforms it to be
    // easier to send to Elm. -- RF: just send rankingData to Elm and deal with
    // it there?

    const rankingDataObj = {
      _id: rankingData[0]._id,
      active: rankingData[0].active,
      name: rankingData[0].name,
      players: {
        playerId: rankingData[0].players.playerId,
        challengerId: rankingData[0].players.challengerId,
        rank: rankingData[0].rank,
      },
      owner_id: rankingData[0].owner_id,
      baseaddress: { street: rankingData[0].street, city: rankingData[0].city },
      
    }
    // NOTE: Send response from mongo TO Elm
    eapp.ports.messageReceiver.send(rankingDataObj)
  } catch (err) {
    console.error('Caught error : ', err)
  }
}

async function runPipeline(rankings, ranking) {
  const rankingData = await rankings.aggregate(
    //NOTE: for new pipeline from text copy from arrary start here,
    // refers to mongodb where build queries in the UI:
    // NOTE: this pipeline has been edited beyond the original adding new fields to match full ranking
    [
      {
        $match: {
          _id: Realm.BSON.ObjectId(ranking.insertedId),
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
        $group: {
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
    ],
    //NOTE: array ends
  )
  return rankingData
}

async function sendJoinRankingToPort(rankingData, operationEvent) {
  //NOTE: Notes in register.js
  console.log('rankingData in sendJoinRankingToPort', rankingData)
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
