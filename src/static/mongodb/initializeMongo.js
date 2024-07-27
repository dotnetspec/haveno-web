// NOTE: This is the main file for communicating with mongodb
// NOTE: This file is imported in index.html
// NOTE: Many of the functions referenced in here are imported from index.html
// NOTE: This file is for a logged in/registered user via realm-web/dist/bundle.iife.js. Spectators will use the node application middleware
// with anon login and Elm http to access mongodb.
/* GitHub Copilot: The error "require is not defined" typically occurs when you're trying to use Node.js-specific code 
(like `require`) in a context that doesn't support it, such as a client-side JavaScript file that's being run in a web browser.

In your case, it seems like you're trying to use the `Realm` package in a client-side JavaScript file. 
The `Realm` package is designed to work with Node.js and React Native, but it doesn't support running directly in a web browser.

If you want to use MongoDB Realm in a web browser, you should use the `realm-web` package instead. 
This package provides a MongoDB Realm SDK that's designed to work in web browsers.
*/
// Add your App ID
const realmapp = new Realm.App({ id: 'sr-espa1-snonq' })

// -- NOTE: globalUser is assigned to in Login and should remain available
// throughout the user session via the access token automatically stored after login
var globalUser = '';
var globalRealm = '';
const noChallengerCurrentlyId = '6353e8b6aedf80653eb34191'

// NOTE: Messages from the Elm 'send' port are received and parsed here to determine
// which function (in the relevant .js file) to use to communicate with Mongodb
function handleMessageFromElm(message) {
  console.log('here in handle : ', message)

  // NOTE: Use FF debugger to view 'message'
  // HACK: This will need to be more robust. It must be something that will never appear in the json:
  const messageArr = message.split('~^&')
  //NOTE: Switch on the message label (element[0]), then handle the , separated params

  switch (messageArr[0]) {
    case 'login':
      const emailStr = messageArr[1]
      const passwordStr = messageArr[2]
      console.log('email : ', emailStr)
      console.log('pword : ', passwordStr)

      login(emailStr, passwordStr)
      break

    case 'register':
      console.log('about to register : ', message)
      const emailStri = messageArr[1]
      const passwordStri = messageArr[2]
      const nickname = messageArr[3]
      register(emailStri, passwordStri, nickname)
      break
    case 'createRanking':
      //NOTE: We only need the id:

      const rankingname = messageArr[1]
      const street = messageArr[2]
      const city = messageArr[3]
      createRanking(rankingname, street, city)
      break
    case 'fetchRanking':
      //NOTE: We only need the id:
      const rankingid = messageArr[1]
      const rankingtype = messageArr[2]
      fetchedRanking(rankingid, rankingtype)
      break
    case 'joinRanking':
      //NOTE: We only need the id:
      const rid = messageArr[1]
      const userid = messageArr[2]
      const rAnk = messageArr[3]
      joinRanking(rid, userid, rAnk)
      break
    case 'leaveRanking':
      //NOTE: We only need the id:
      const rnid = messageArr[1];
      const usrid = messageArr[2];
      const updateRanking = messageArr[3];
      console.log ('update ranking in initialize' , updateRanking);
      leaveRanking(rnid, usrid, updateRanking)
      break
      //REVIEW: Consider if updateRanking can be used more generically, but not crucial
    case 'updateRanking':
      //NOTE: We only need the id:
      const rnkid = messageArr[1];
      
      const updateRankingWithResult = messageArr[2];
      console.log ('update ranking in initialize' , updateRankingWithResult);
      //NOTE: updateRanking now in it's own module, but must use updateRankingGeneric
      // for scope reasons
      updateRankingGeneric(rnkid, updateRankingWithResult)
      break

      
    case 'deleteRanking':
      //NOTE: We only need the id:
      const rankid = messageArr[1]
      //REVIEW: send all globalUser from here for consistency or use in the relevant function?
      deleteRanking(globalUser, rankid)
      break
    case 'updateForChallenge':
      //NOTE: We only need the id(?), which we have to name 'rankingidentifier':
      const rankingidentifier = messageArr[1]
      const playerid = messageArr[2]
      const challengerid = messageArr[3]
      const rank = messageArr[4]
      updateForChallenge(rankingidentifier, playerid, challengerid, rank)
      break

    case 'handleResult':
      const rankngid = messageArr[1]
      const playrid = messageArr[2]
      const challengrid = messageArr[3]
      const rnk = messageArr[4]
      
      handleResult(rankngid, playrid, challengrid, rnk)
      break

    case 'deleteAccount':
      const userId = messageArr[1]
      
      deleteUser_Data(userId)
      break

    //NOTE: We're going to talk to mongodb via the node application
    // to do searches, so we can do them anonymously
    // We will make http requests from within Elm to the node application

    case 'logout':
      logOut(globalUser)
      break
    //NOTE: Adding a new function? Added it to index.html?
    default:
      console.log(`Sorry, problem:  ${message}.`)
  }
}
