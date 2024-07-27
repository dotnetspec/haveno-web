async function abandonAllUserChallenges(userid, users, rankings) {
    const noChallengerCurrentlyId = '6353e8b6aedf80653eb34191' //  noChallengerCurrentlyId
    const userId = userid

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid userId');
  }
  
    // Get the user's memberOf array
    const user = await users.findOne({ _id: Realm.BSON.ObjectId(userId) })
    const memberOf = user.memberOf
  
    let totalModifiedCount = 0
  
    // For each ranking in the memberOf array, update the players array
    for (let rankingId of memberOf) {
      const res1 = await rankings.updateMany(
        { _id: Realm.BSON.ObjectId(rankingId), 'players.playerId': Realm.BSON.ObjectId(userId) },
        {
          $set: {
            'players.$[].challengerId': Realm.BSON.ObjectId(noChallengerCurrentlyId),
            
          },
        },
      )
      const res2 = await rankings.updateMany(
        { _id: Realm.BSON.ObjectId(rankingId), 'players.challengerId': Realm.BSON.ObjectId(userId) },
        {
          $set: {
            'players.$[].challengerId': Realm.BSON.ObjectId(noChallengerCurrentlyId),
            
          },
        },
      )
      totalModifiedCount += res1.modifiedCount + res2.modifiedCount
    }
  
    return { success: true, modifiedCount: totalModifiedCount }
  }

  async function abandonSingleUserChallenge(userid, rankingId, rankings) {
    const noChallengerCurrentlyId = '6353e8b6aedf80653eb34191' //  noChallengerCurrentlyId
    
  
    let totalModifiedCount = 0
  
  
      const res1 = await rankings.updateMany(
        { _id: Realm.BSON.ObjectId(rankingId), 'players.playerId': Realm.BSON.ObjectId(userid) },
        {
          $set: {
            'players.$[].challengerId': Realm.BSON.ObjectId(noChallengerCurrentlyId),
            
          },
        },
      )
      const res2 = await rankings.updateMany(
        { _id: Realm.BSON.ObjectId(rankingId), 'players.challengerId': Realm.BSON.ObjectId(userid) },
        {
          $set: {
            'players.$[].challengerId': Realm.BSON.ObjectId(noChallengerCurrentlyId),
            
          },
        },
      )
      totalModifiedCount += res1.modifiedCount + res2.modifiedCount
    
  
    return { success: true, modifiedCount: totalModifiedCount }
  }