async function deleteUser_Data(userid) {
  //const credentials = Realm.Credentials.emailPassword(email, password)
  try {
    // Login the user so the app has a 'currentUser' to delete

    //NOTE: a globalUser is only assigned to in Login and should remain available
    const mongo = globalUser.mongoClient('mongodb-atlas')
    const users = mongo.db('sportrank').collection('users')
    const rankings = mongo.db('sportrank').collection('rankings')
    try {
      //Delete all the user's OWNED rankings
      // Fetch the user document
      const user = await users.findOne({ _id: Realm.BSON.ObjectId(userid) });

      if (user) {
        // Iterate over the ownerOf array
        for (const rankingId of user.ownerOf) {
          try {
            // Delete the ranking
            const ownedRankingsDeletionResult = await deleteRanking(rankingId, rankings);
          } catch (err) {
            console.error(`Caught error in deleteRanking for rankingId ${rankingId}: `, err);
          }
        }
      } else {
        console.error(`User with id ${userid} not found`);
      }
      //Remove any reference to the user in any rankings and challenges affecting other users
      //abandonAllUserChallenges so there is no reference to this user in any challenges affecting other users
      const result = await abandonAllUserChallenges(userid, users, rankings)
      if (result.success) {
        console.log(
          `Successfully abandoned all challenges. ${result.modifiedCount} documents were modified.`,
        )
        //Delete user from all member rankings
        try {
          let ranking = await rankings.findOne({
            'players.playerId': Realm.BSON.ObjectId(userid),
          })

          while (ranking !== null) {
            try {
              await deleteUserFromRanking(userid, rankings, ranking)
            } catch (err) {
              console.error('Caught error in deleteUserFromRanking: ', err)
            }

            // Fetch the next ranking
            ranking = await rankings.findOne({
              'players.playerId': Realm.BSON.ObjectId(userid),
            })
          }

          // Check if the user's id is no longer in any rankings
          const remainingRanking = await rankings.findOne({
            'players.playerId': Realm.BSON.ObjectId(userid),
          })

          if (remainingRanking === null) {
            console.log("User's id is no longer in any rankings")
            // Set memberOf array to empty - no need, we're deleting user
            /* await users.updateOne(
              { _id: Realm.BSON.ObjectId(userid) },
              { $set: { memberOf: [] } },
            ) */
            try {

              //del the user account - currently get error, but still the account is deleted:
              //RF: error	"invalid session: failed to find refresh token"
              // error_code	"InvalidSession"
              //change to token session management?


              //NOTE: Make sure the user has been del from the mongodb system admin 'Users' list
              //Only then del the user document from the 'users' collection
              //NOTE: It appears that if realmapp.deleteUser WORKS then it returns 'undefined'

              //
              const resultOfDeletingUserFromCollection = await users.deleteOne({
                _id: Realm.BSON.ObjectId(userid),
              })

              //NOTE: Del user from the mongodb SYSTEM ADMIN 'Users' list
              if (resultOfDeletingUserFromCollection != null) {
                const deletedUser = await realmapp.deleteUser(
                  realmapp.currentUser,
                )

                await sendDeleteUserConfirmToElmPort(result)
                console.log('Deleted user: ', deletedUser)
                logOut(globalUser)
                console.log('Logged out user: ', globalUser)
              } else {
                console.log('Failed to delete user from collection')
              }


            } catch (error) {
              console.error(
                'Caught error whilst deleting user document and account: ',
                error,
              )
            }
          } else {
            console.log("User's id is still in some rankings")
          }
        } catch (err) {
          console.error(
            'Caught error whilst deleting user from all member rankings: ',
            err,
          )
        }
      } else {
        console.log('Failed to abandon all challenges.')
      }
    } catch (err) {
      console.error('Caught error in abandonAllUserChallenges: ', err)
    }
  } catch (err) {
    console.error('Caught error in deleteUser_Data: ', err)
  }
}

//RF: Do this in elm and send the result to js
// Delete a user from a ranking and re-order the remaining players
async function deleteUserFromRanking(userid, rankings, ranking) {
  // Delete the user from the ranking
  await rankings.updateOne(
    { _id: ranking._id },
    { $pull: { players: { playerId: Realm.BSON.ObjectId(userid) } } },
  )

  // Fetch the updated ranking
  ranking = await rankings.findOne({ _id: ranking._id })

  // Re-order the ranks of the remaining players
  for (let i = 0; i < ranking.players.length; i++) {
    await rankings.updateOne(
      {
        _id: ranking._id,
        'players.playerId': Realm.BSON.ObjectId(ranking.players[i].playerId),
      },
      { $set: { 'players.$.rank': i + 1 } },
    )
  }
}

async function sendDeleteUserConfirmToElmPort(rankingData) {
  // NOTE: Notes in register.js

  additionalDataObjExtendibleIfRequired = { userid: '', nickname: '' }

  jsonMsgToElm = {
    operationEventMsg: 'USERDELETECOMPLETE',
    dataFromMongo: rankingData,
   
    additionalDataFromJs: additionalDataObjExtendibleIfRequired,
  }

  // NOTE: Send data TO Elm
  eapp.ports.messageReceiver.send(jsonMsgToElm)
}
