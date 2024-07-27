// NOTE:  gets called from iniitalizeMongo.js
// NOTE: for debugging use de-bugger, not Console.log unless necessary for detail

// REVIEW: Currently, nothing sent back to Elm from this module
// NOTE: Named updateRankingGeneric so 'updateRanking' doesn't get confused elsewhere
async function updateRankingGeneric(rankingid, updatedRanking) {
  try {
    const mongo = globalUser.mongoClient("mongodb-atlas");
    const rankings = mongo.db("sportrank").collection("rankings");
    //const users = mongo.db("sportrank").collection("users");

    
      try {
        //NOTE: updatedRanking necessarily came through the port as a string
        // Now we convert it back to a json obj that mondodb can handle
        const jsonParsedUpdatedRanking = JSON.parse(updatedRanking);
        //NOTE: we must change the ids from strings to ObjectIds for mongodb:
        const objectIdConvertedJsonParsedUpdatedRanking =
          convertStringIntoRealmBSONObjectIdInUpdateRanking(jsonParsedUpdatedRanking);
        // NOTE: removePlayerFromRanking - this has replaced the aggregate pipeline. If AI cannot assist
        // with a db update, then it may be necessary to revert to the aggregate pipeline (in older commits)
        const result2 = await updateRanking(
          rankings,
          rankingid,
          objectIdConvertedJsonParsedUpdatedRanking
        );
        return result2
      } catch (error) {
        console.error(
          "Error: updateRanking - but the db is probably still updated",
          error
        );
      }
    }catch (error) {
      console.error(
        "Error: updateRanking - problem with the mongo client",
        error
      );
    }
}

async function updateRanking(rankings, rankingid, parsedUpdatedRanking) {
  console.log("updateRanking: ", parsedUpdatedRanking);
  try {
    const result = await rankings.findOneAndUpdate(
      { _id: Realm.BSON.ObjectId(rankingid) },
      {
        $set: { players: parsedUpdatedRanking.players },
      },
      { returnOriginal: false }
    );

    return { success: true, parsedUpdatedRanking: result };
  } catch (error) {
    console.error("Error: ", error);
  }
}


//REVIEW: Add to utils? Also used in leaveRanking.js (slight name diff)
function convertStringIntoRealmBSONObjectIdInUpdateRanking(obj) {
  if (obj._id) {
    obj._id = Realm.BSON.ObjectId(obj._id);
  }

  if (obj.owner_id) {
    obj.owner_id = Realm.BSON.ObjectId(obj.owner_id);
  }

  if (obj.players) {
    obj.players = obj.players.map((player) => {
      if (player.playerId) {
        player.playerId = Realm.BSON.ObjectId(player.playerId);
      }
      if (player.challengerId) {
        player.challengerId = Realm.BSON.ObjectId(player.challengerId);
      }
      if (player.rank) {
        player.rank = parseInt(player.rank);
      }
      return player;
    });
  }

  return obj;
}


