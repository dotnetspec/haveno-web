

// NOTE: This will trigger 'funcDeleteOwnedRankingFromUser' in mongodb

async function deleteRanking(rankingid, rankings) {
  try {
    // Delete a single document
    rankings.deleteOne(
      { _id: Realm.BSON.ObjectId(rankingid) },
      (deleteErr, result) => {
        if (deleteErr) {
          console.error('Error deleting document:', deleteErr)
        } else {
          console.log('Document deleted successfully:', result)
        }

        
      },
    )
  } catch (err) {
    console.error('Caught error : ', err)
  }
}
