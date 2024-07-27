// NOTE:  gets called from iniitalizeMongo.js
// NOTE: for debugging use de-bugger, not Console.log unless necessary for detail

// REVIEW: Currently, nothing sent back to Elm from this module

async function leaveRanking(rankingid, userid, updatedRanking) {
  try {
    const mongo = globalUser.mongoClient("mongodb-atlas");
    const rankings = mongo.db("sportrank").collection("rankings");
    const users = mongo.db("sportrank").collection("users");

    try {
      //NOTE: Stringified updatedRanking will be parsed in updateRanking
      //NOTE: updateRanking now in it's own module
      const result2 = await updateRankingGeneric(
        rankingid,
        updatedRanking
      );
      if (result2.success) {
        try {
          const result = await removeRankingFromUser(rankingid, userid, users);
        } catch (error) {
          console.error(
            "Error: removeRankingFromUser - but the db is probably still updated",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "Error: updateRanking - but the db is probably still updated",
        error
      );
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}



async function removeRankingFromUser(rankingid, userid, users) {
  try {
    const result = await users.updateOne(
      { _id: Realm.BSON.ObjectId(userid) },
      { $pull: { memberOf: Realm.BSON.ObjectId(rankingid) } }
    );

    return result;
  } catch (error) {
    console.error("Error in removeRankingFromUser : ", error);
  }
}

function convertStringIntoRealmBSONObjectId(obj) {
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
