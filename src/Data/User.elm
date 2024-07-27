-- NOTE: User is an opaque type - you can declare U.User elsewhere, but you have to create and expose
-- functions to work with the assoc. data within it.
-- REVIEW: Why then is User for e.g. exposed?


module Data.User exposing (..)

{- ( Admin(..)
   , Gender(..)
   , MemberRanking
   , OwnedRanking
   , Password
   ,  Token
      -- NOTE: You can expose type variants with (..) (but should you?),
      -- User must be ref with U.User in other modules that don't expose it.
      -- NOTE: Fields on a type alias like UserInfo can't be exposed with (..)
      -- UserInfo is not exposed in consuming modules

   , User(..)
   , UserInfo
   , UserOps(..)
   ,  deactivate
      -- query

   , emptyRegisteredUser
   , emptySpectator
   , emptyUserInfo
   , gotId
   , gotNickName
   ,  isNickNameEmpty
      -- update

   ,  removedInvalidRankingId
      -- delete

   , updatedComment
   , updatedEmail
   , updatedLevel
   ,  updatedMemberRankings
      --, newUser
      -- read

   , updatedMobile
   , updatedNickName
   , updatedOwndedRankings
   , updatedPassword
   , userInfoDecoder
   )
-}

import Data.Ranking as R
import Json.Decode as D
import Json.Decode.Pipeline as P
import Time exposing (Month(..))
import Utils.Validation.Validate as V



-- NOTE: 'Users (EverySet User)' is not the same type as '(EverySet User)'
-- Peter Damoc
-- You can think about the tag ('Users') as a box containing a type.
-- There can only ever be registered users in the User set
-- Type 'Users' is a type with a variant 'Users' and assoc. data (EverySet User)
-- NOTE: UserState here was deprecated in favour of
-- GlobalOps Admin


type User
    = Spectator UserInfo
    | Registered UserInfo


type Gender
    = Male
    | Female


emptyRegisteredUser : User
emptyRegisteredUser =
    Registered emptyUserInfo


emptySpectator : User
emptySpectator =
    Spectator emptyUserInfo



-- NAV: UserInfo
-- NOTE: Cannot just e.g. InputChg with a type that replaces UserInfo cos Msg type is in Main.
-- REVIEW: pwd needed in userInfo?
-- how is email going to be obtained?


type alias UserInfo =
    { userid : String

    -- NOTE: Need the password field
    -- in userInfo to manage password updates
    , password : Password
    , passwordValidationError : String
    , token : Maybe Token
    , nickname : NickName
    , isNameInputFocused : Bool
    , nameValidationError : String
    , age : Int
    , gender : Gender
    , email : Maybe String
    , isEmailInputFocused : Bool
    , emailValidationError : String
    , mobile : Maybe String
    , isMobileInputFocused : Bool
    , mobileValidationError : String
    , datestamp : Int
    , active : Bool

    -- NOTE: RankingOps does many ops on a ranking, but currenlty too hard
    -- to transition to
    , ownedRankings : List R.Ranking
    , memberRankings : List R.Ranking
    , updatetext : String
    , description : Description

    --, mobile : String
    , credits : Int
    , addInfo : String
    }



-- REVIEW: The problem with strong typing is that rawjson has to be decoded to
-- basic types - at least initially


type alias OwnedRanking =
    { id : String
    , name : String
    }


type alias MemberRanking =
    { id : String
    , name : String
    }


type alias Description =
    { level : String
    , comment : String
    }



-- REVIEW: Are these type aliases being used correctly?


type alias Token =
    String


type alias NickName =
    String


type alias Password =
    String



-- NAV: empty values


emptyUserInfo : UserInfo
emptyUserInfo =
    -- NOTE: Using UserInfo as a constructor function for the alias type.
    -- REVIEW: the exposure implications. Also, random number gen in docs for Anon.
    UserInfo "" "" "" Nothing "" False "" 40 Male Nothing False "" Nothing False "" 0 False [] [] "" emptyDescription 0 ""


emptyDescription : Description
emptyDescription =
    { level = "", comment = "" }



-- NAV: userDecoder
-- RF: There should probably only be one userDecoder. For now had to split.
-- REVIEW: Attempting a better way in style of SP-Responsive:
-- NAV: Current
--|> optional "name" string "blah"


userInfoDecoder : D.Decoder UserInfo
userInfoDecoder =
    -- REVIEW: userForDecoder was created to avoid exposing User variants (not yet hidden). Best approach?
    D.succeed UserInfo
        --userForDecoder
        |> P.required "_id" idDecoder
        --idObjectDecoder
        |> P.optional "email" D.string ""
        |> P.optional "password" D.string ""
        |> P.required "token" (D.maybe D.string)
        |> P.required "nickname" D.string
        -- NOTE: Put these optional in so that fits UserInfo,
        -- but we're not expecting them from the json:
        |> P.optional "isNameInputFocused" D.bool False
        |> P.optional "nameValidationError" D.string ""
        |> P.optional "age" numberDecoder 20
        |> P.optional "gender" genderDecoder Male
        |> P.optional "email" (D.maybe D.string) Nothing
        |> P.optional "isEmailInputFocused" D.bool False
        |> P.optional "emailValidationError" D.string ""
        |> P.required "mobile" (D.maybe D.string)
        |> P.optional "isMobileInputFocused" D.bool False
        |> P.optional "mobileValidationError" D.string ""
        -- NOTE: user number decoder?
        |> P.required "datestamp" numberDecoder --(D.field "$numberInt" stringToIntDecoder)
        |> P.required "active" D.bool
        |> P.required "ownedRankings" (D.list R.rankingDecoder)
        |> P.required "memberRankings" (D.list R.rankingDecoder)
        |> P.optional "updatetext" D.string ""
        -- NOTE: The base type decoders are defined in the decoder
        |> P.required "description" descriptionDecoder
        --|> P.required "mobile" D.string
        |> P.required "credits" (D.field "$numberInt" stringToIntDecoder)
        |> P.optional "addInfo" D.string "No additional info supplied"


idDecoder : D.Decoder String
idDecoder =
    D.field "$oid" D.string
        
stringToIntDecoder : D.Decoder Int
stringToIntDecoder =
    D.string
        |> D.andThen (\str -> case String.toInt str of
            Just num -> D.succeed num
            Nothing -> D.fail "Expected an integer")

numberDecoder : D.Decoder Int
numberDecoder =
    D.field "$numberInt" D.string
        |> D.andThen (\str -> case String.toInt str of
            Just num -> D.succeed num
            Nothing -> D.fail "Expected an integer")


-- NOTE: Decode a custom type:


genderDecoder : D.Decoder Gender
genderDecoder =
    D.string
        |> D.andThen
            (\str ->
                case str of
                    "Male" ->
                        D.succeed Male

                    "Female" ->
                        D.succeed Female

                    _ ->
                        D.fail "Invalid gender"
            )



-- NOTE: User distinguishes between owned and member rankings
-- but distinction not necessary for purposes of decoding,
-- so we can just use OwnedRanking as pattern for decoder.
-- NOTE: Ranking is a record, so we provide a custom decoder
-- NOTE: userRankingsDecoder is for Global data:


userRankingsDecoder : D.Decoder OwnedRanking
userRankingsDecoder =
    D.succeed OwnedRanking
        -- NOTE: Remember, P.required are field functions
        --(they do work to figure out what the e.g. _id string is and make it match the Elm type)
        -- D.string is not a String, it is a String Decoder (i.e. one that the field function can take as an arg)
        |> P.required "_id" D.string
        |> P.required "name" D.string



-- NOTE: Description is a record, so we provide a custom decoder


descriptionDecoder : D.Decoder Description
descriptionDecoder =
    D.succeed Description
        |> P.required "level" D.string
        |> P.required "comment" D.string



-- NAV: Update


updatedEmail : User -> String -> User
updatedEmail user str =
    case user of
        Spectator userInfo ->
            Spectator { userInfo | email = Just str }

        Registered userInfo ->
            Registered { userInfo | email = Just str }


updatedPassword : User -> String -> User
updatedPassword user str =
    case user of
        Spectator userInfo ->
            Spectator { userInfo | password = str }

        Registered userInfo ->
            Registered { userInfo | password = str }


updatedNickName : User -> String -> User
updatedNickName user str =
    --{ userInfo | nickname = str }
    case user of
        Spectator userInfo ->
            Spectator { userInfo | nickname = str }

        Registered userInfo ->
            Registered { userInfo | nickname = str }


deactivate : UserInfo -> UserInfo
deactivate userInfo =
    { userInfo | active = False }


updatedOwndedRankings : UserInfo -> List R.Ranking -> UserInfo
updatedOwndedRankings userInfo lRanking =
    { userInfo | ownedRankings = lRanking }


updatedMemberRankings : UserInfo -> List R.Ranking -> UserInfo
updatedMemberRankings userInfo lRanking =
    { userInfo | memberRankings = lRanking }


updatedLevel : User -> String -> User
updatedLevel user level =
    let
        desc =
            gotDescriptionFromUser user

        newDesc =
            { desc | level = level }
    in
    case user of
        Spectator userInfo ->
            Spectator { userInfo | description = newDesc }

        Registered userInfo ->
            Registered { userInfo | description = newDesc }


updatedComment : User -> String -> User
updatedComment user comment =
    let
        desc =
            gotDescriptionFromUser user

        newDesc =
            { desc | comment = comment }
    in
    case user of
        Spectator userInfo ->
            Spectator { userInfo | description = newDesc }

        Registered userInfo ->
            Registered { userInfo | description = newDesc }



-- NOTE: Helper functions


gotDescriptionFromUser : User -> Description
gotDescriptionFromUser user =
    case user of
        Spectator userInfo ->
            userInfo.description

        Registered userInfo ->
            userInfo.description


updatedMobile : User -> String -> User
updatedMobile user str =
    case user of
        Spectator userInfo ->
            Spectator { userInfo | mobile = Just str }

        Registered userInfo ->
            Registered { userInfo | mobile = Just str }


gotNickName : User -> String
gotNickName user =
    case user of
        Spectator userInfo ->
            userInfo.nickname

        Registered userInfo ->
            userInfo.nickname


isNickNameEmpty : User -> Bool
isNickNameEmpty u =
    if gotNickName u == "" then
        True

    else
        False


gotId : User -> String
gotId user =
    case user of
        Spectator _ ->
            ""

        Registered userInfo ->
            userInfo.userid


removedInvalidRankingId : String -> Maybe String
removedInvalidRankingId rankingId =
    if V.isValidRankingId rankingId then
        Just rankingId

    else
        Nothing


gotUserInfo : User -> UserInfo
gotUserInfo user =
    case user of
        Registered usrInfo ->
            usrInfo

        _ ->
            emptyUserInfo


gotOwnedRankings : User -> List R.Ranking
gotOwnedRankings user =
    case user of
        Registered usrInfo ->
            usrInfo.ownedRankings

        _ ->
            []


gotMemberRankings : User -> List R.Ranking
gotMemberRankings user =
    case user of
        Registered usrInfo ->
            usrInfo.memberRankings

        _ ->
            []



-- NOTE: These below are only deleting the ranking from the UI
-- not from the DB (handled in the middleware)


deleteRankingFromMemberRankings : User -> String -> List R.Ranking
deleteRankingFromMemberRankings user rankingid =
    case user of
        Registered usrInfo ->
            List.filter (\ranking -> ranking.id /= rankingid) usrInfo.memberRankings

        _ ->
            []


deleteRankingFromOwnedRankings : User -> String -> User
deleteRankingFromOwnedRankings user rankingid =
    case user of
        Registered usrInfo ->
            let
                newRankingList =
                    List.filter (\ranking -> ranking.id /= rankingid) usrInfo.ownedRankings
            in
            Registered { usrInfo | ownedRankings = newRankingList }

        _ ->
            emptyRegisteredUser


addNewLadderToOwnedRankings : User -> R.Ranking -> User
addNewLadderToOwnedRankings user ranking =
    case user of
        Registered usrInfo ->
            let
                rankingExists =
                    List.any (\r -> r.id == ranking.id) usrInfo.ownedRankings
            in
            if rankingExists then
                user

            else
                let
                    newRankingList =
                        ranking :: usrInfo.ownedRankings
                in
                Registered { usrInfo | ownedRankings = newRankingList }

        _ ->
            emptyRegisteredUser


addNewLadderToMemberRankings : User -> R.Ranking -> User
addNewLadderToMemberRankings user ranking =
    case user of
        Registered usrInfo ->
            let
                rankingExists =
                    List.any (\r -> r.id == ranking.id) usrInfo.memberRankings
            in
            if rankingExists then
                user

            else
                let
                    newRankingList =
                        ranking :: usrInfo.memberRankings
                in
                Registered { usrInfo | memberRankings = newRankingList }

        _ ->
            emptyRegisteredUser
