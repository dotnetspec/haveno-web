
//NOTE: This appears to be an early file for updating user details.  
//If using this, use leaveRanking (json encoded) as a template

// Add your App ID
// instantiate the realmapp
const realmapp = new Realm.App({ id: "sr-espa1-snonq" });

async function updateNicknameAsync() {
  // XXX: A user must be logged in to use a mongoClient
const credentials = Realm.Credentials.emailPassword("test1@test.com", "Pa55w0rd");
    try {
      // Authenticate the user
      const user = await realmapp.logIn(credentials);
      // `App.currentUser` updates to match the logged in user - only logs in console if false
      console.assert(user.id === realmapp.currentUser.id);

      const mongo = user.mongoClient("mongodb-atlas");
      const collection = mongo.db("sportrank").collection("users");
      
      const filter = {
        id: user.id, // Query for the user object of the logged in user
      };
      
      const updateDoc = {
        $set: {
          nickname: "Michael", // Set the logged in user's nickname
        },
      };
      
      const result = await collection.updateOne(filter, updateDoc);
    
      return result;
    } catch (err) {
      console.error("Failed to login/update user", err);
    }
  }

  function updateNickname () {
    //XXX: invoke loginEmailPassword from authentication.js to login to mongodb realm
    (async function() {
      const result = await updateNicknameAsync();        
    })();
  }