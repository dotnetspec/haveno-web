-- Rankings is an opaque type - create and expose functions to work with it


module Data.Ranking exposing (..)

import Extras.Constants as Consts
import Json.Decode as D
import Json.Decode.Pipeline as P exposing (required)
import Json.Encode as E



-- RF


type RankingOps
    = Ladder RankingStatus Admin


type RankingStatus
    = Owned Ranking
    | Member Ranking
    | Spectator Ranking
    | None


type Admin
    = --View
      --|
      Create
    | Confirm
    | Delete
    | CreateChallenge Rank
      --| ConfirmChallenge
    | CreateResult Rank
    | ConfirmResult ResultOfMatch
    | AddPlayer
    | RemovePlayer


type ResultOfMatch
    = Won
    | Lost
    | Undecided


type alias Ranking =
    { id : String
    , active : Bool
    , name : String
    , owner_id : String
    , baseaddress : BaseAddress
    , ladder : List Rank
    , player_count : Int
    , owner_name : String
    }


type alias NewlyCreatedRanking =
    { insertedId : String
    }


type alias NewlyJoinedRanking =
    { id : D.Value
    }


type alias RankingSearchResult =
    { id : String

    -- TODO: Add active field
    --, active : Bool
    , name : String
    }

    



type alias BaseAddress =
    { street : String
    , city : String
    }


type alias Rank =
    { rank : Int
    , player : Player
    , challenger : Player
    }


type alias Player =
    { id : String
    , nickname : String
    }


type alias ChallengeResult =
    { playerRank : Rank
    , challengerRank : Rank
    }



-- NAV: Json encoders
-- NOTE: E.object [] returns an object, not an array
-- NOTE: jsonUpdatedRanking is tested in RankingTest.elm


rankFromWebsocketDecoder : D.Decoder Rank
rankFromWebsocketDecoder =
    D.succeed Rank
        |> required "rank" D.int
        |> required "playerId" playerDecoder
        |> required "challengerId" playerDecoder


playersFromWebsocketDecoder : D.Decoder (List Rank)
playersFromWebsocketDecoder =
    D.field "players" (D.list rankDecoder)


jsonUpdatedRanking : Ranking -> E.Value
jsonUpdatedRanking updatedRanking =
    E.object
        [ ( "_id", E.string updatedRanking.id )
        , ( "active", E.bool updatedRanking.active )
        , ( "name", E.string updatedRanking.name )
        , ( "owner_id", E.string updatedRanking.owner_id )
        , ( "baseaddress", encodeBaseAddress updatedRanking.baseaddress )
        , ( "players", E.list encodeRank updatedRanking.ladder )

        -- FIX:User not ownerid here:
        , ( "lastUpdatedBy", E.string updatedRanking.owner_id ) -- replace with actual lastUpdatedBy id
        ]


encodeBaseAddress : BaseAddress -> E.Value
encodeBaseAddress baseaddress =
    E.object
        [ ( "street", E.string baseaddress.street )
        , ( "city", E.string baseaddress.city )
        ]


encodeRank : Rank -> E.Value
encodeRank rank =
    E.object
        [ ( "playerId", E.string rank.player.id )
        , ( "challengerId", E.string rank.challenger.id )
        , ( "rank", E.string (String.fromInt rank.rank) )
        ]



-- NAV: Decoders
{- decoders module a problem cos decoders are tightly coupled to the types they work on. e.g. ranking module currently has types and decoders.
   Does decoder module import ranking types or other way round? If decoders module does then all decoders and assoc types (ie. across all modules)
   have to live there as well, which makes the type modules more irrelevant.
-}


baseAddressDecoder : D.Decoder BaseAddress
baseAddressDecoder =
    D.succeed BaseAddress
        |> P.required "street" D.string
        |> P.required "city" D.string


rankDecoder : D.Decoder Rank
rankDecoder =
    D.succeed Rank
        -- NOTE: Remember, P.required are field functions
        --(they do work to figure out what the e.g. _id string is and make it match the Elm type)
        -- D.string is not a String, it is a String Decoder (i.e. one that the field function can take as an arg)
        |> P.required "rank" D.int
        |> P.required "player" playerDecoder
        |> P.required "challenger" playerDecoder


playerDecoder : D.Decoder Player
playerDecoder =
    D.succeed Player
        -- NOTE: Remember, P.required are field functions
        --(they do work to figure out what the e.g. _id string is and make it match the Elm type)
        -- D.string is not a String, it is a String Decoder (i.e. one that the field function can take as an arg)
        -- Remember: below has to match order in Player, otherwise e.g. _id and nickname wrong way round
        |> P.required "_id" D.string
        |> P.required "nickname" D.string

ownerIdDecoder : D.Decoder String
ownerIdDecoder =
    D.field "$oid" D.string

idDecoder : D.Decoder String
idDecoder =
    D.field "$oid" D.string


rankingDecoder : D.Decoder Ranking
rankingDecoder =
    D.succeed Ranking
        |> P.required "_id" idDecoder
        |> P.required "active" D.bool
        |> P.required "name" D.string
        |> P.required "owner_id" ownerIdDecoder
        |> P.required "baseaddress" baseAddressDecoder
        |> P.optional "ranking" (D.list rankDecoder) [emptyRank]
        |> P.optional "player_count" D.int 1
        |> P.required "owner_name" D.string



-- REVIEW: Why won't these decoders work?


newlyCreatedRankingIdDecoder : D.Decoder NewlyCreatedRanking
newlyCreatedRankingIdDecoder =
    D.succeed NewlyCreatedRanking
        |> P.required "insertedId" D.string


extractInsertedId : D.Value -> Result D.Error String
extractInsertedId jsonValue =
    D.decodeValue (D.field "insertedId" D.string) jsonValue



-- HACK: This is a hack to get around the fact that the insertedId is not
-- returned as a field in the json, but as a string in the json string


extractInsertedIdFromString : String -> Maybe String
extractInsertedIdFromString jsonString =
    let
        splitString =
            String.split "\"" jsonString
    in
    case splitString of
        [ _, _, _, insertedId, _ ] ->
            Just insertedId

        _ ->
            Nothing


newlyJoinedRankingDecoder : D.Decoder NewlyJoinedRanking
newlyJoinedRankingDecoder =
    D.succeed NewlyJoinedRanking
        |> P.required "_id" D.value


inspectJson : String -> Result String D.Value
inspectJson jsonString =
    case D.decodeString D.value jsonString of
        Ok value ->
            -- The JSON was successfully decoded into a Value.
            -- You can now inspect the Value to see its structure.
            Ok value

        Err err ->
            -- There was an error decoding the JSON.
            -- The error message will give you some information about what went wrong.
            Err (D.errorToString err)


rankingSearchResultDecoder : D.Decoder RankingSearchResult
rankingSearchResultDecoder =
    D.succeed RankingSearchResult
        |> P.required "_id" D.string
        --|> P.required "active" D.bool
        |> P.required "name" D.string


emptyRanking : Ranking
emptyRanking =
    { id = ""
    , owner_name = ""
    , owner_id = ""
    , player_count = 0
    , active = False
    , baseaddress = { street = "", city = "" }

    -- HACK: Not currently able to handle db/js errors such
    -- as non-existent users (ObjectId <user's id not exist>)
    -- in a ranking or any other occasions where we get . At least we can provide this msg for now:
    , name = ""
    , ladder =
        [ emptyRank ]
    }


emptyRank : Rank
emptyRank =
    { rank = 0
    , player = { nickname = "String", id = "String" }
    , challenger = { nickname = "String", id = "String" }
    }


emptyPlayer : Player
emptyPlayer =
    { id = "0"
    , nickname = ""
    }



-- NAV: Ranking Functions:
-- NOTE: removeRank is tested in RankingTest.elm


noChallengerCurrently : Player
noChallengerCurrently =
    { id = Consts.noCurrentChallengerId
    , nickname = "No Challenger"
    }


abandonSingleUserChallenge : String -> List Rank -> List Rank
abandonSingleUserChallenge userId ranks =
    List.map
        (\rank ->
            if rank.player.id == userId || rank.challenger.id == userId then
                { rank | challenger = noChallengerCurrently }

            else
                rank
        )
        ranks


userWon : String -> List Rank -> List Rank
userWon userId ranks =
    List.map
        (\rank ->
            if rank.challenger.id == userId then
                { rank | player = rank.challenger, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }

            else if rank.player.id == userId then
                { rank | player = rank.challenger, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }

            else
                rank
        )
        ranks


userLost : String -> List Rank -> List Rank
userLost userId ranks =
    List.map
        (\rank ->
            if rank.player.id == userId then
                { rank | player = rank.challenger, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }

            else if rank.challenger.id == userId then
                { rank | player = rank.challenger, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }

            else
                rank
        )
        ranks


createSingleUserChallenge : String -> Player -> List Rank -> List Rank
createSingleUserChallenge playerId newChallenger ranks =
    let
        player1 =
            List.head (List.filter (\r -> r.player.id == playerId) ranks) |> Maybe.map .player |> Maybe.withDefault newChallenger
    in
    List.map
        (\rank ->
            if rank.player.id == playerId then
                { rank | challenger = newChallenger }

            else if rank.player.id == newChallenger.id then
                { rank | challenger = player1 }

            else
                rank
        )
        ranks


removeRank : String -> List Rank -> List Rank
removeRank playerId ranks =
    ranks
        |> List.filter (\rank -> rank.player.id /= playerId)
        |> List.indexedMap (\index rank -> { rank | rank = index + 1 })


updatedRankingName : Ranking -> String -> Ranking
updatedRankingName ranking str =
    { ranking | name = str }


updatedStreet : Ranking -> String -> Ranking
updatedStreet ranking str =
    let
        baseaddress =
            ranking.baseaddress

        newBaseAddress =
            { baseaddress | street = str }
    in
    { ranking | baseaddress = newBaseAddress }


updatedCity : Ranking -> String -> Ranking
updatedCity ranking str =
    let
        baseaddress =
            ranking.baseaddress

        newBaseAddress =
            { baseaddress | city = str }
    in
    { ranking | baseaddress = newBaseAddress }


gotRanking : RankingStatus -> Ranking
gotRanking ls =
    case ls of
        Owned ranking ->
            ranking

        Member ranking ->
            ranking

        Spectator ranking ->
            ranking

        None ->
            emptyRanking


gotRankingId : Ranking -> String
gotRankingId ranking =
    ranking.id


isCurrentlyInAChallenge : Rank -> Bool
isCurrentlyInAChallenge rank =
    if
        rank.player.id
            == Consts.noCurrentChallengerId
            || rank.challenger.id
            == Consts.noCurrentChallengerId
    then
        False

    else
        True


isUserOwnerOfRankning : String -> Ranking -> Bool
isUserOwnerOfRankning userid ranking =
    if
        ranking.owner_id
            == userid
    then
        True

    else
        False



-- Function to find the minimum element in a list based on a custom field
-- Function to find the minimum element in a list based on a custom field
-- Function to find the minimum element in a list based on a custom field
-- Assuming you have the Rank type alias already defined
-- Function to find the minimum element in a list based on a custom field
-- WARN: Remember the highest to us is the LOWEST number!
-- Really this function finds the 'highest' rank NUMERICALLY
-- gotLowestRank is just a name


gotLowestRank : List Rank -> Maybe Rank
gotLowestRank ranks =
    case ranks of
        [] ->
            Nothing

        [ rank ] ->
            Just rank

        head :: tail ->
            let
                findMaxHelper currentMax remainingList =
                    case remainingList of
                        [] ->
                            currentMax

                        next :: rest ->
                            if next.rank > currentMax.rank then
                                findMaxHelper next rest

                            else
                                findMaxHelper currentMax rest
            in
            Just (findMaxHelper head tail)


handleResult :
    ResultOfMatch
    -> String
    -> List Rank
    -> List Rank
handleResult resultofmatch userid lrank =
    case resultofmatch of
        Won ->
            userWon userid lrank

        Lost ->
            userLost userid lrank

        Undecided ->
            abandonSingleUserChallenge userid lrank



-- REVIEW: Remove?


increaseRank : Rank -> Rank
increaseRank rank =
    { rank | rank = rank.rank - 1 }


decreaseRank : Rank -> Rank
decreaseRank rank =
    { rank | rank = rank.rank + 1 }


gotRankBelow : Rank -> List Rank -> Maybe Rank
gotRankBelow rank ranks =
    let
        rankBelow =
            List.filter (\r -> r.rank == rank.rank + 1) ranks
    in
    case rankBelow of
        [] ->
            Nothing

        [ rnk ] ->
            Just rnk

        head :: tail ->
            Just head


tempNewlyCreatedRanking : String -> String -> String -> Ranking
tempNewlyCreatedRanking id owner_name name =
    { id = id
    , owner_id = "0"
    , name = name
    , active = False
    , baseaddress = { street = "", city = "" }
    , ladder = [ emptyRank ]
    , player_count = 0
    , owner_name = owner_name
    }


-- NAV: Helper functions

-- NOTE: JSON/string manipulation functions
-- En/decoding doesn't always work out as expected
-- These functions tweak strings to be ready for use/display
-- Best practice to keep as D.Value for as long as possible



                               

newlyJoinedRankingIdAsValueManipulation : NewlyJoinedRanking -> String
newlyJoinedRankingIdAsValueManipulation newlyJoinedRanking =
    let
        jsonEncodedId =
            String.trim (E.encode 0 newlyJoinedRanking.id)

        trimmedId =
            String.dropLeft 1 (String.dropRight 1 jsonEncodedId)
    in
    trimmedId
