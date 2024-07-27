module Pages.Tests.Test_Rankings exposing (..)

import Data.Ranking as R exposing (..)
import Dict exposing (fromList)
import Expect
import Extras.Constants as Consts exposing (..)
import Json.Decode as D exposing (..)
import Json.Encode as E exposing (..)
import Pages.Rankings exposing (..)
import Test exposing (..)


tests : Test
tests =
    -- NOTE: tests and the actual code are based essentially on the rankBeingIterated, but  loggedInUser's context is also needed
    describe "determineButtonType"
        [ test
            ("1. should return 1 (challengeInProgressBtnEnabled) when user is in challenge and"
                ++ "the loggedInUser's playerid is the same as the rankBeingIterated playerid "
            )
          <|
            \_ ->
                let
                    player1 =
                        { id = "1", nickname = "" }

                    challenger1 =
                        { id = "2", nickname = "" }

                    loggedInUsersRank =
                        { rank = 1, player = player1, challenger = challenger1 }

                    player2 =
                        { id = "1", nickname = "" }

                    challenger2 =
                        { id = "2", nickname = "" }

                    rankBeingIterated =
                        { rank = 2, player = player2, challenger = challenger2 }
                in
                determineButtonType loggedInUsersRank rankBeingIterated
                    |> Expect.equal 1
        , test
            ("2. returns 2 (challengeInProgressBtnDisabled) when user is in"
                ++ "challenge and and the loggedInUser's playerid is the same as the rankBeingIterated challengerid "
            )
          <|
            \_ ->
                let
                    player1 =
                        { id = "1", nickname = "" }

                    challenger1 =
                        { id = "2", nickname = "" }

                    loggedInUsersRank =
                        { rank = 1, player = player1, challenger = challenger1 }

                    player2 =
                        { id = "2", nickname = "" }

                    challenger2 =
                        { id = "1", nickname = "" }

                    rankBeingIterated =
                        { rank = 2, player = player2, challenger = challenger2 }
                in
                determineButtonType loggedInUsersRank rankBeingIterated
                    |> Expect.equal 2
        , test
            ("3. should return 3 (singlePlayerBtnEnabled) when the loggedInUser is not in a challenge "
                ++ "and rankBeingIterated is not in challenge and rankBeingIterated is 1 higher than the loggedInUsersRank"
            )
          <|
            \_ ->
                let
                    player1 =
                        { id = "1", nickname = "" }

                    challenger1 =
                        { id = Consts.noCurrentChallengerId, nickname = "" }

                    loggedInUsersRank =
                        { rank = 5, player = player1, challenger = challenger1 }

                    player2 =
                        { id = "2", nickname = "" }

                    challenger2 =
                        { id = Consts.noCurrentChallengerId, nickname = "" }

                    -- NOTE:
                    rankBeingIterated =
                        { rank = 4, player = player2, challenger = challenger2 }
                in
                determineButtonType loggedInUsersRank rankBeingIterated
                    |> Expect.equal 3
        , test
            ("4. should return 4 (singlePlayerBtnDisabled) when current user is not in challenge,"
                ++ "but the rank below is, and the rank is lower than the current user"
            )
          <|
            \_ ->
                let
                    emptyrank =
                        R.emptyRank

                    loggedInUsersRank =
                        { emptyrank | rank = 2 }

                    player2 =
                        { id = "5", nickname = "" }

                    challenger2 =
                        { id = "4", nickname = "" }

                    rankBeingIterated =
                        { rank = 3, player = player2, challenger = challenger2 }
                in
                determineButtonType loggedInUsersRank rankBeingIterated
                    |> Expect.equal 4
        , test "5. should return 4 (singlePlayerBtnDisabled) when current user is in challenge, but the rank above is not, and the rank is higher than the current user" <|
            \_ ->
                let
                    emptyrank =
                        R.emptyRank

                    loggedInUsersRank =
                        { emptyrank | rank = 3 }

                    player1 =
                        { id = "2", nickname = "Bobby" }

                    challenger1 =
                        { id = Consts.noCurrentChallengerId, nickname = "" }

                    rankBeingIterated =
                        { rank = 2, player = player1, challenger = challenger1 }
                in
                determineButtonType loggedInUsersRank rankBeingIterated
                    |> Expect.equal 4
        , test "6. should return 4 (singlePlayerBtnDisabled) when user is in challenge and the rankBeingIterated is neither player or challenger" <|
            \_ ->
                let
                    player1 =
                        { id = "1", nickname = "" }

                    challenger1 =
                        { id = "2", nickname = "" }

                    loggedInUsersRank =
                        { rank = 2, player = player1, challenger = challenger1 }

                    player2 =
                        { id = "3", nickname = "" }

                    challenger2 =
                        { id = "4", nickname = "" }

                    rankBeingIterated =
                        { rank = 6, player = player2, challenger = challenger2 }
                in
                -- submit either rank, should not make any difference
                determineButtonType loggedInUsersRank rankBeingIterated
                    |> Expect.equal 4
        , test
            ("7. should return 2 (challengeInProgressBtnDisabled) when the loggedInUser is not in a challenge "
                ++ "and rankBeingIterated is in a challenge and rankBeingIterated is 1 higher than the loggedInUsersRank"
            )
          <|
            \_ ->
                let
                    player1 =
                        { id = "1", nickname = "" }

                    challenger1 =
                        { id = Consts.noCurrentChallengerId, nickname = "" }

                    loggedInUsersRank =
                        { rank = 5, player = player1, challenger = challenger1 }

                    player2 =
                        { id = "2", nickname = "" }

                    challenger2 =
                        { id = "3", nickname = "" }

                    rankBeingIterated =
                        { rank = 4, player = player2, challenger = challenger2 }
                in
                determineButtonType loggedInUsersRank rankBeingIterated
                    |> Expect.equal 2
        , test "8. fullDocumentDecoder test" <|
            \_ ->
                let
                    json =
                        """{
                            "_id": "62c66dc612296752b7c82cde",
                            "active": true,
                            "name": "Bobbys Lads",
                            "players": [
                                {
                                    "playerId": "652e2b3441c3decf3044f7c9",
                                    "challengerId": "6353e8b6aedf80653eb34191",
                                    "rank": 1
                                },
                                {
                                    "playerId": "655441c96eb7b94ec384a1d5",
                                    "challengerId": "6353e8b6aedf80653eb34191",
                                    "rank": 2
                                }
                               
                            ],
                            "owner_id": "652e2b3441c3decf3044f7c9",
                            "baseaddress": {
                                "street": "99 George Street",
                                "city": "Super City"
                            },
                            "lastUpdatedBy": "651fa006b15a534c69b119ef",
                            "_id__baas_transaction": "656fd8ca60ae275a00683ddb"
                        }"""

                    expectedFullDocument =
                        { id = "62c66dc612296752b7c82cde"
                        , active = True
                        , name = "Bobbys Lads"
                        , players =
                            Just
                                [ Pages.Rankings.PlayerFromChangeEvent "652e2b3441c3decf3044f7c9" "6353e8b6aedf80653eb34191" 1
                                , Pages.Rankings.PlayerFromChangeEvent "655441c96eb7b94ec384a1d5" "6353e8b6aedf80653eb34191" 2

                                -- add more as required
                                ]
                        , ownerId = "652e2b3441c3decf3044f7c9"
                        , baseAddress = { street = "99 George Street", city = "Super City" }
                        , lastUpdatedBy = "651fa006b15a534c69b119ef"
                        }
                in
                D.decodeString fullDocumentDecoder json
                    |> Expect.equal (Ok expectedFullDocument)
        , test "9. changeDecoder test" <|
            \_ ->
                let
                    json =
                        """{
                           "operationType": "update",
                           "documentKey": {
                               "_id": "62c66dc612296752b7c82cde"
                           },
                           "updateDescription": {
                               "updatedFields": {
                                   "_id__baas_transaction": "656fd8ca60ae275a00683ddb"
                               },
                               "removedFields": [],
                               "truncatedArrays": []
                           },
                           "fullDocument": {
                               "_id": "62c66dc612296752b7c82cde",
                               "active": true,
                               "name": "Bobbys Lads",
                               "players.4": [
                                   {
                                       "playerId": "652e2b3441c3decf3044f7c9",
                                       "challengerId": "6353e8b6aedf80653eb34191",
                                       "rank": 1
                                   },
                                {
                                    "playerId": "655441c96eb7b94ec384a1d5",
                                    "challengerId": "6353e8b6aedf80653eb34191",
                                    "rank": 2
                                }

                               ],
                               "owner_id": "652e2b3441c3decf3044f7c9",
                               "baseaddress": {
                                   "street": "99 George Street",
                                   "city": "Super City"
                               },
                               "lastUpdatedBy": "651fa006b15a534c69b119ef",
                               "_id__baas_transaction": "656fd8ca60ae275a00683ddb"
                           }
                       }"""

                    expectedChange =
                        Change "update"
                            { id = "62c66dc612296752b7c82cde" }
                            { updatedFields = Dict.fromList [ ( "_id__baas_transaction", [] ) ]
                            , removedFields = []
                            , truncatedArrays = []
                            }
                            (Just
                                { id = "62c66dc612296752b7c82cde"
                                , active = True
                                , name = "Bobbys Lads"

                                -- NOTE: We expect Nothing cos of "players.4" in the json
                                , players = Nothing

                                {- Just [ {
                                       playerId = "652e2b3441c3decf3044f7c9",
                                       challengerId = "6353e8b6aedf80653eb34191",
                                       rank = 1
                                   },
                                   -- NOTE: This is another way to define a playerFromChangeEvent
                                   Pages.Rankings.PlayerFromChangeEvent "655441c96eb7b94ec384a1d5" "6353e8b6aedf80653eb34191" 2 ]
                                -}
                                , ownerId = "652e2b3441c3decf3044f7c9"
                                , baseAddress = { street = "99 George Street", city = "Super City" }
                                , lastUpdatedBy = "651fa006b15a534c69b119ef"
                                }
                            )
                in
                D.decodeString changeDecoder json
                    |> Expect.equal (Ok expectedChange)
        , test "10. ensureDataIsJsonObj should always return a value" <|
            \_ ->
                let
                    jsonData =
                        JsonData (E.object [ ( "key", E.string "value" ) ])

                    stringData =
                        StringData "Error - dataFromMongo is a value"

                    complexStringData =
                        StringData """
                {
                    "operationType": "update",
                    "documentKey": {
                        "_id": "62c66dc612296752b7c82cde"
                    },
                    "updateDescription": {
                        "updatedFields": {
                            "players.4": {
                                "playerId": "651fa006b15a534c69b119ef",
                                "challengerId": "6353e8b6aedf80653eb34191",
                                "rank": 5
                            }
                        },
                        "removedFields": [
                            "_id__baas_transaction"
                        ],
                        "truncatedArrays": []
                    },
                    "fullDocument": {
                        "_id": "62c66dc612296752b7c82cde",
                        "active": true,
                        "name": "Bobbys Lads",
                        "players": [
                            {
                                "playerId": "652e2b3441c3decf3044f7c9",
                                "challengerId": "6353e8b6aedf80653eb34191",
                                "rank": 1
                            },
                            {
                                "playerId": "655441c96eb7b94ec384a1d5",
                                "challengerId": "6353e8b6aedf80653eb34191",
                                "rank": 2
                            },
                            {
                                "playerId": "655865e5fec6567140b1a9d7",
                                "challengerId": "6353e8b6aedf80653eb34191",
                                "rank": 3
                            },
                            {
                                "playerId": "6551bc6809fe1612f0d426d4",
                                "challengerId": "6353e8b6aedf80653eb34191",
                                "rank": 4
                            },
                            {
                                "playerId": "651fa006b15a534c69b119ef",
                                "challengerId": "6353e8b6aedf80653eb34191",
                                "rank": 5
                            }
                        ],
                        "owner_id": "652e2b3441c3decf3044f7c9",
                        "baseaddress": {
                            "street": "99 George Street",
                            "city": "Super City"
                        },
                        "lastUpdatedBy": "651fa006b15a534c69b119ef"
                    }
                }
                """

                    testCases =
                        [ jsonData, stringData, complexStringData ]
                in
                List.map ensureDataIsJsonObj testCases
                    |> List.all (\result -> result /= E.object [ ( "Error :", E.string "Problem converting json to value" ) ])
                    |> Expect.equal True
        , test "11. websocket change event decoders - should decode a Change JSON" <|
            \_ ->
                let
                    json =
                        """{
             "operationType": "update",
             "documentKey": {
               "_id": "62c66dc612296752b7c82cde"
             },
             "updateDescription": {
               "updatedFields": {
                 "players.4": {
                   "playerId": "651fa006b15a534c69b119ef",
                   "challengerId": "6353e8b6aedf80653eb34191",
                   "rank": 5
                 }
               },
               "removedFields": [
                 "_id__baas_transaction"
               ],
               "truncatedArrays": []
             },
             "fullDocument": {
               "_id": "62c66dc612296752b7c82cde",
               "active": true,
               "name": "Bobbys Lads",
               "players": [
                 {
                   "playerId": "652e2b3441c3decf3044f7c9",
                   "challengerId": "6353e8b6aedf80653eb34191",
                   "rank": 1
                 },
                 {
                   "playerId": "655441c96eb7b94ec384a1d5",
                   "challengerId": "6353e8b6aedf80653eb34191",
                   "rank": 2
                 },
                 {
                   "playerId": "655865e5fec6567140b1a9d7",
                   "challengerId": "6353e8b6aedf80653eb34191",
                   "rank": 3
                 },
                 {
                   "playerId": "6551bc6809fe1612f0d426d4",
                   "challengerId": "6353e8b6aedf80653eb34191",
                   "rank": 4
                 },
                 {
                   "playerId": "651fa006b15a534c69b119ef",
                   "challengerId": "6353e8b6aedf80653eb34191",
                   "rank": 5
                 }
               ],
               "owner_id": "652e2b3441c3decf3044f7c9",
               "baseaddress": {
                 "street": "99 George Street",
                 "city": "Super City"
               },
               "lastUpdatedBy": "651fa006b15a534c69b119ef"
             }
           }"""

                    expectedChange =
                        Change "update"
                            { id = "62c66dc612296752b7c82cde" }
                            { updatedFields = Dict.fromList [ ( "players.4", [ PlayerFromChangeEvent "651fa006b15a534c69b119ef" "6353e8b6aedf80653eb34191" 5 ] ) ]
                            , removedFields = [ "_id__baas_transaction" ]
                            , truncatedArrays = []
                            }
                            (Just
                                { active = True
                                , baseAddress = { city = "Super City", street = "99 George Street" }
                                , id = "62c66dc612296752b7c82cde"
                                , lastUpdatedBy = "651fa006b15a534c69b119ef"
                                , name = "Bobbys Lads"
                                , ownerId = "652e2b3441c3decf3044f7c9"
                                , players =
                                    Just
                                        [ { challengerId = "6353e8b6aedf80653eb34191"
                                          , playerId = "652e2b3441c3decf3044f7c9"
                                          , rank = 1
                                          }
                                        , { challengerId = "6353e8b6aedf80653eb34191"
                                          , playerId = "655441c96eb7b94ec384a1d5"
                                          , rank = 2
                                          }
                                        , { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 3 }
                                        , { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 4 }
                                        , { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 5 }
                                        ]
                                }
                            )
                in
                D.decodeString changeDecoder json
                    |> Expect.equal (Ok expectedChange)
        , test "12. websocket change event decoders - UpdateDescription decoder" <|
            \_ ->
                let
                    json =
                        """{ "updatedFields": { "players": [{ "playerId": "651fa006b15a534c69b119ef", "challengerId": "6353e8b6aedf80653eb34191", "rank": 5 }] }, "removedFields": [ "_id__baas_transaction" ], "truncatedArrays": [] }"""

                    expectedUpdateDescription =
                        UpdateDescription (Dict.fromList [ ( "players", [ PlayerFromChangeEvent "651fa006b15a534c69b119ef" "6353e8b6aedf80653eb34191" 5 ] ) ]) [ "_id__baas_transaction" ] []
                in
                D.decodeString updateDescriptionDecoder json
                    |> Expect.equal (Ok expectedUpdateDescription)
        , test "13. websocket change event decoders - PlayerFromChangeEvent decoder" <|
            \_ ->
                let
                    json =
                        """{ "playerId": "651fa006b15a534c69b119ef", "challengerId": "6353e8b6aedf80653eb34191", "rank": 5 }"""

                    expectedPlayer =
                        PlayerFromChangeEvent "651fa006b15a534c69b119ef" "6353e8b6aedf80653eb34191" 5
                in
                D.decodeString playerFromChangeEventDecoder json
                    |> Expect.equal (Ok expectedPlayer)
        , test "14. websocket change event decoders - DocumentKey decoder" <|
            \_ ->
                let
                    json =
                        """{ "_id": "62c66dc612296752b7c82cde" }"""

                    expectedDocumentKey =
                        DocumentKey "62c66dc612296752b7c82cde"
                in
                D.decodeString documentKeyDecoder json
                    |> Expect.equal (Ok expectedDocumentKey)
        , test "15. websocket change event decoders - Change decoder" <|
            \_ ->
                let
                    json =
                        """{
                               "operationType": "update",
                               "documentKey": {
                                   "_id": "62c66dc612296752b7c82cde"
                               },
                               "updateDescription": {
                                   "updatedFields": {
                                   "players.4": {
                                       "playerId": "651fa006b15a534c69b119ef",
                                       "challengerId": "6353e8b6aedf80653eb34191",
                                       "rank": 5
                                   }
                                   },
                                   "removedFields": [
                                   "_id__baas_transaction"
                                   ],
                                   "truncatedArrays": []
                               },
                               "fullDocument": {
                                   "_id": "62c66dc612296752b7c82cde",
                                   "active": true,
                                   "name": "Bobbys Lads",
                                   "players": [
                                   {
                                       "playerId": "652e2b3441c3decf3044f7c9",
                                       "challengerId": "6353e8b6aedf80653eb34191",
                                       "rank": 1
                                   },
                                   {
                                       "playerId": "655441c96eb7b94ec384a1d5",
                                       "challengerId": "6353e8b6aedf80653eb34191",
                                       "rank": 2
                                   },
                                   {
                                       "playerId": "655865e5fec6567140b1a9d7",
                                       "challengerId": "6353e8b6aedf80653eb34191",
                                       "rank": 3
                                   },
                                   {
                                       "playerId": "6551bc6809fe1612f0d426d4",
                                       "challengerId": "6353e8b6aedf80653eb34191",
                                       "rank": 4
                                   },
                                   {
                                       "playerId": "651fa006b15a534c69b119ef",
                                       "challengerId": "6353e8b6aedf80653eb34191",
                                       "rank": 5
                                   }
                                   ],
                                   "owner_id": "652e2b3441c3decf3044f7c9",
                                   "baseaddress": {
                                   "street": "99 George Street",
                                   "city": "Super City"
                                   },
                                   "lastUpdatedBy": "651fa006b15a534c69b119ef"
                               }
                               }"""

                    expectedChange =
                        Change "update"
                            { id = "62c66dc612296752b7c82cde" }
                            { updatedFields = Dict.fromList [ ( "players.4", [ PlayerFromChangeEvent "651fa006b15a534c69b119ef" "6353e8b6aedf80653eb34191" 5 ] ) ]
                            , removedFields = [ "_id__baas_transaction" ]
                            , truncatedArrays = []
                            }
                            (Just { active = True, baseAddress = { city = "Super City", street = "99 George Street" }, id = "62c66dc612296752b7c82cde", lastUpdatedBy = "651fa006b15a534c69b119ef", name = "Bobbys Lads", ownerId = "652e2b3441c3decf3044f7c9", players = Just [ { challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 2 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 3 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 4 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 5 } ] })
                in
                D.decodeString changeDecoder json
                    |> Expect.equal (Ok expectedChange)
        , test "16. playerFromChangeEventDecoder. should decode a single PlayerFromChangeEvent" <|
            \_ ->
                let
                    json =
                        """
                           {
                               "playerId": "player1",
                               "challengerId": "challenger1",
                               "rank": 1
                           }
                           """
                in
                case decodeString playerFromChangeEventDecoder json of
                    Ok player ->
                        player
                            |> (\p -> p.playerId)
                            |> Expect.equal "player1"

                    Err _ ->
                        Expect.fail "Expected to decode a PlayerFromChangeEvent"
        , test "17. playerFromChangeEventDecoder. should decode a list of PlayerFromChangeEvent" <|
            \_ ->
                let
                    json =
                        """
                       [
                           {
                               "playerId": "player1",
                               "challengerId": "challenger1",
                               "rank": 1
                           },
                           {
                               "playerId": "player2",
                               "challengerId": "challenger2",
                               "rank": 2
                           }
                       ]
                       """
                in
                case decodeString updatedFieldDecoder json of
                    Ok players ->
                        players
                            |> List.length
                            |> Expect.equal 2

                    Err _ ->
                        Expect.fail "Expected to decode a list of PlayerFromChangeEvent"
        , test "18. websocket change event decoders - fullDocument decoder" <|
            \_ ->
                let
                    json =
                        """{
                       "operationType": "update",
                       "documentKey": {
                           "_id": "62c66dc612296752b7c82cde"
                       },
                       "updateDescription": {
                           "updatedFields": {
                           "players.4": {
                               "playerId": "651fa006b15a534c69b119ef",
                               "challengerId": "6353e8b6aedf80653eb34191",
                               "rank": 5
                           }
                           },
                           "removedFields": [
                           "_id__baas_transaction"
                           ],
                           "truncatedArrays": []
                       },
                       "fullDocument": {
                           "_id": "62c66dc612296752b7c82cde",
                           "active": true,
                           "name": "Bobbys Lads",
                           "players": [
                           {
                               "playerId": "652e2b3441c3decf3044f7c9",
                               "challengerId": "6353e8b6aedf80653eb34191",
                               "rank": 1
                           },
                           {
                               "playerId": "655441c96eb7b94ec384a1d5",
                               "challengerId": "6353e8b6aedf80653eb34191",
                               "rank": 2
                           },
                           {
                               "playerId": "655865e5fec6567140b1a9d7",
                               "challengerId": "6353e8b6aedf80653eb34191",
                               "rank": 3
                           },
                           {
                               "playerId": "6551bc6809fe1612f0d426d4",
                               "challengerId": "6353e8b6aedf80653eb34191",
                               "rank": 4
                           },
                           {
                               "playerId": "651fa006b15a534c69b119ef",
                               "challengerId": "6353e8b6aedf80653eb34191",
                               "rank": 5
                           }
                           ],
                           "owner_id": "652e2b3441c3decf3044f7c9",
                           "baseaddress": {
                           "street": "99 George Street",
                           "city": "Super City"
                           },
                           "lastUpdatedBy": "651fa006b15a534c69b119ef"
                       }
                       }"""

                    expectedChange =
                        Change "update"
                            { id = "62c66dc612296752b7c82cde" }
                            { updatedFields = fromList [ ( "players.4", [ PlayerFromChangeEvent "651fa006b15a534c69b119ef" "6353e8b6aedf80653eb34191" 5 ] ) ]
                            , removedFields = [ "_id__baas_transaction" ]
                            , truncatedArrays = []
                            }
                            (Just { active = True, baseAddress = { city = "Super City", street = "99 George Street" }, id = "62c66dc612296752b7c82cde", lastUpdatedBy = "651fa006b15a534c69b119ef", name = "Bobbys Lads", ownerId = "652e2b3441c3decf3044f7c9", players = Just [ { challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 2 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 3 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 4 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 5 } ] })
                in
                D.decodeString changeDecoder json
                    |> Expect.equal (Ok expectedChange)
        , test "19. websocket change event decoders - updateFields expect Object" <|
            \_ ->
                let
                    json =
                        """{
                           "operationType": "update",
                           "documentKey": {
                               "_id": "62c66dc612296752b7c82cde"
                           },
                           "updateDescription": {
                               "updatedFields": {
                               "_id__baas_transaction": "656fd8ca60ae275a00683ddb"
                               },
                               "removedFields": [],
                               "truncatedArrays": []
                           },
                           "fullDocument": {
                               "_id": "62c66dc612296752b7c82cde",
                               "active": true,
                               "name": "Bobbys Lads",
                               "players": [
                               {
                                   "playerId": "652e2b3441c3decf3044f7c9",
                                   "challengerId": "6353e8b6aedf80653eb34191",
                                   "rank": 1
                               },
                               {
                                   "playerId": "655441c96eb7b94ec384a1d5",
                                   "challengerId": "6353e8b6aedf80653eb34191",
                                   "rank": 2
                               },
                               {
                                   "playerId": "655865e5fec6567140b1a9d7",
                                   "challengerId": "6353e8b6aedf80653eb34191",
                                   "rank": 3
                               },
                               {
                                   "playerId": "6551bc6809fe1612f0d426d4",
                                   "challengerId": "6353e8b6aedf80653eb34191",
                                   "rank": 4
                               }
                               ],
                               "owner_id": "652e2b3441c3decf3044f7c9",
                               "baseaddress": {
                               "street": "99 George Street",
                               "city": "Super City"
                               },
                               "lastUpdatedBy": "651fa006b15a534c69b119ef",
                               "_id__baas_transaction": "656fd8ca60ae275a00683ddb"
                           }
                           }"""

                    expectedChange =
                        Change "update"
                            { id = "62c66dc612296752b7c82cde" }
                            { --updatedFields = fromList [ ( "_id__baas_transaction", [Pages.Rankings.IdbaasTransaction (IdbaasTransactionFromUpdatedFields "656fd8ca60ae275a00683ddb")]) ]
                              -- HACK: This is not adequately testing _id__baas_transaction here, -- FIX if necessary
                              updatedFields = Dict.fromList [ ( "_id__baas_transaction", [] ) ]
                            , removedFields = []
                            , truncatedArrays = []
                            }
                            (Just { active = True, baseAddress = { city = "Super City", street = "99 George Street" }, id = "62c66dc612296752b7c82cde", lastUpdatedBy = "651fa006b15a534c69b119ef", name = "Bobbys Lads", ownerId = "652e2b3441c3decf3044f7c9", players = Just [ { challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 2 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 3 }, { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 4 } ] })
                in
                D.decodeString changeDecoder json
                    |> Expect.equal (Ok expectedChange)
        , test "20. Decode newly joined ranking _id field as string from JSON value" <|
            \_ ->
                let
                    jsonStr =
                        "{\"_id\":\"62c66dc612296752b7c82cde\",\"active\":true,\"name\":\"Bobbys Lads\",\"players\":[{\"playerId\":\"652e2b3441c3decf3044f7c9\",\"challengerId\":\"6353e8b6aedf80653eb34191\",\"rank\":1},{\"playerId\":\"655441c96eb7b94ec384a1d5\",\"challengerId\":\"6353e8b6aedf80653eb34191\",\"rank\":2},{\"playerId\":\"655865e5fec6567140b1a9d7\",\"challengerId\":\"6353e8b6aedf80653eb34191\",\"rank\":3},{\"playerId\":\"6551bc6809fe1612f0d426d4\",\"challengerId\":\"6353e8b6aedf80653eb34191\",\"rank\":4}],\"owner_id\":\"652e2b3441c3decf3044f7c9\",\"baseaddress\":{\"street\":\"99 George Street\",\"city\":\"Super City\"},\"lastUpdatedBy\":\"651fa006b15a534c69b119ef\"}"

                    convertedJson =
                        case convertJsonStringToJsonValue jsonStr of
                            Ok jsonValue ->
                                jsonValue

                            Err _ ->
                                E.object [ ( "key1", E.string "default value 1" ) ]

                    gotIdval =
                        case getIdFromValue convertedJson of
                            Ok id ->
                                id

                            Err _ ->
                                "error"
                in
                Expect.equal "62c66dc612296752b7c82cde" <| gotIdval

            , test "21. player leaving ladder - filterAndSortRankingsOnLeaving - should remove and reorder rankings - middle player in list  - no challenger" <|
            \_ ->
                let
                    ladder =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 5 }
                        ]

                    changes =
                        [ ( "players"
                          , [ { challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 2 }
                            --, { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 3 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 3 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 4 }
                            ]
                          )
                        ]

                    expected =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        --, { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 4 }
                        ]
                in
                filterAndSortRankingsOnLeaving "655865e5fec6567140b1a9d7" ladder changes
                    |> Expect.equal expected

            , test "22. player leaving ladder - filterAndSortRankingsOnLeaving - should remove and reorder rankings - first player in list - no challenger" <|
            \_ ->
                let
                    ladder =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 5 }
                        ]

                    changes =
                        [ ( "players"
                          , [ --{ challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }
                            --, 
                            { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 1 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 2 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 3 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 4 }
                            ]
                          )
                        ]

                    expected =
                        [ --{ challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        --, 
                        { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 4 }
                        ]
                in
                filterAndSortRankingsOnLeaving "652e2b3441c3decf3044f7c9" ladder changes
                    |> Expect.equal expected

            , test "23. player leaving ladder - filterAndSortRankingsOnLeaving - should remove and reorder rankings - last player in list - no challenger" <|
            \_ ->
                let
                    ladder =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 5 }
                        ]

                    changes =
                        [ ( "players"
                          , [ { challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }
                            , 
                            { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 2 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 3 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 4 }
                            --, { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 4 }
                            ]
                          )
                        ]

                    expected =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , 
                        { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        --, { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 4 }
                        ]
                in
                filterAndSortRankingsOnLeaving "651fa006b15a534c69b119ef" ladder changes
                    |> Expect.equal expected

            , test "24. player leaving ladder - filterAndSortRankingsOnLeaving - should remove and reorder rankings - middle player in list - WITH challenger" <|
            \_ ->
                let
                    ladder =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 5 }
                        ]

                    changes =
                        [ ( "players"
                          , [ { challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 2 }
                            --, { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 3 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 3 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 4 }
                            ]
                          )
                        ]

                    expected =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        --, { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 4 }
                        ]
                in
                filterAndSortRankingsOnLeaving "655865e5fec6567140b1a9d7" ladder changes
                    |> Expect.equal expected

            , test "25. player leaving ladder - filterAndSortRankingsOnLeaving - should remove and reorder rankings - first player in list - WITH challenger" <|
            \_ ->
                let
                    ladder =
                         [ { challenger = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 5 }
                        ]

                    changes =
                        [ ( "players"
                          , [ --{ challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }
                            --, 
                            { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 1 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 2 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 3 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 4 }
                            ]
                          )
                        ]

                    expected =
                        [ --{ challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        --, 
                        { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 4 }
                        ]
                in
                filterAndSortRankingsOnLeaving "652e2b3441c3decf3044f7c9" ladder changes
                    |> Expect.equal expected

            ,test "26. player leaving ladder - filterAndSortRankingsOnLeaving - should remove and reorder rankings - last player in list - WITH challenger" <|
            \_ ->
                let
                    ladder =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        , { challenger = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 5 }
                        ]

                    changes =
                        [ ( "players"
                          , [ { challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }
                            , 
                            { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 2 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 3 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 4 }
                            --, { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 4 }
                            ]
                          )
                        ]

                    expected =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , 
                        { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        --, { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 4 }
                        ]
                in
                filterAndSortRankingsOnLeaving "651fa006b15a534c69b119ef" ladder changes
                    |> Expect.equal expected

            , test "27. player JOINING ladder - filterAndSortRankingsOnJoining - should add and reorder rankings - no challenger" <|
            \_ ->
                let
                    ladder =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        --, { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, rank = 5 }
                        ]

                    changes =
                        [ ( "players"
                          , [ { challengerId = "6353e8b6aedf80653eb34191", playerId = "652e2b3441c3decf3044f7c9", rank = 1 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "655441c96eb7b94ec384a1d5", rank = 2 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "655865e5fec6567140b1a9d7", rank = 3 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "6551bc6809fe1612f0d426d4", rank = 4 }
                            , { challengerId = "6353e8b6aedf80653eb34191", playerId = "651fa006b15a534c69b119ef", rank = 5 }
                            ]
                          )
                        ]

                    expected =
                        [ { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, rank = 1 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 2 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, rank = 3 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "6551bc6809fe1612f0d426d4", nickname = "k4anon" }, rank = 4 }
                        , { challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "651fa006b15a534c69b119ef", nickname = "New Player" }, rank = 5 }
                        ]
                in
                filterAndSortRankingsOnJoining "651fa006b15a534c69b119ef" ladder changes
                    |> Expect.equal expected
        ]
