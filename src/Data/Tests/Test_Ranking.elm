module Data.Tests.Test_Ranking exposing (..)

import Data.Ranking as R exposing (Player, Rank, Ranking, gotLowestRank)
import Data.User as U exposing (..)
import Expect
import Extras.Constants as Consts
import Fuzz exposing (intRange, list)
import Json.Decode as D
import Json.Encode as E
import Test exposing (..)



-- Define some dummy players
-- Define 15 players


players : List Player
players =
    List.map (\i -> Player ("id" ++ String.fromInt i) ("Player " ++ String.fromInt i)) (List.range 1 15)


noChallenger : { id : String, nickname : String }
noChallenger =
    { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }



-- WARN: Remember the highest to us is the LOWEST number!
-- Really this function finds the 'highest' rank NUMERICALLY
-- gotLowestRank is just a name


gotLowestRankTest : Test
gotLowestRankTest =
    describe "4. gotLowestRank function"
        [ fuzz (list (intRange 1 15)) "returns the rank with the highest rank for a list with multiple ranks" <|
            \nums ->
                let
                    ranks =
                        List.indexedMap (\i num -> Rank num (getPlayer i) (getPlayer (i + 1))) nums

                    expected =
                        maximumBy .rank ranks
                in
                gotLowestRank ranks |> Expect.equal expected
        ]


getPlayer : Int -> Player
getPlayer i =
    List.head (List.drop (remainderBy i 15) players) |> Maybe.withDefault (Player "default" "Default Player")


maximumBy : (a -> comparable) -> List a -> Maybe a
maximumBy f list =
    case list of
        [] ->
            Nothing

        x :: xs ->
            Just <|
                List.foldl
                    (\y acc ->
                        if f y > f acc then
                            y

                        else
                            acc
                    )
                    x
                    xs


tests : Test
tests =
    describe "Ranking tests"
        [ test "1. Test Won condition" <|
            \_ ->
                let
                    -- NOTE: Players cannot select a lower ranked challenge in the UI
                    -- so here only rank = 1 can be selected
                    -- TODO: Add more ranks and test players
                    ranklist =
                        [ { rank = 1, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, challenger = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" } }
                        , { rank = 2, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, challenger = { id = "651fa006b15a534c69b119ef", nickname = "Dave" } }
                        ]

                    -- expectedChallengeResultBobbyCurrent
                    expectedChallengeResultDaveCurrent =
                        [ { rank = 1
                          , player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        , { rank = 2
                          , player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        ]

                    expectedChallengeResultBobbyCurrent =
                        [ { rank = 1
                          , player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        , { rank = 2
                          , player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        ]
                in
                -- NOTE: The RESULT of the function being tested (handleResult) is what comes AFTER 'Expect.equal' in the test output
                Expect.equal (R.handleResult R.Won "652e2b3441c3decf3044f7c9" ranklist) expectedChallengeResultBobbyCurrent
        , test "2. Test Lost condition" <|
            \_ ->
                let
                    ranklist =
                        [ { rank = 1, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, challenger = noChallenger }
                        , { rank = 2, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, challenger = noChallenger }
                        , { rank = 3, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, challenger = noChallenger }
                        , { rank = 4, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, challenger = { id = "656832ed860026c91f04f8a7", nickname = "alan" } }
                        , { rank = 5, player = { id = "656832ed860026c91f04f8a7", nickname = "alan" }, challenger = { id = "651fa006b15a534c69b119ef", nickname = "Dave" } }
                        ]

                    -- expectedChallengeResultDaveCurrent
                    --True  -- expectedChallengeResultBobbyCurrent
                    expectedChallengeResultDaveCurrent =
                        [ { rank = 1
                          , player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }
                          , challenger = noChallenger
                          }
                        , { rank = 2
                          , player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }
                          , challenger = noChallenger
                          }
                        , { rank = 3
                          , player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }
                          , challenger = noChallenger
                          }
                        , { rank = 4, player = { id = "656832ed860026c91f04f8a7", nickname = "alan" }, challenger = noChallenger }
                        , { rank = 5, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, challenger = noChallenger }
                        ]

                    {- expectedChallengeResultBobbyCurrent =
                        { playerRank =
                            { rank = 1
                            , player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }
                            , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                            }
                        , challengerRank =
                            { rank = 2
                            , player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }
                            , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                            }
                        } -}
                in
                Expect.equal (R.handleResult R.Lost "651fa006b15a534c69b119ef" ranklist) expectedChallengeResultDaveCurrent
        , test "3. Test Undecided condition" <|
            \_ ->
                let
                    ranklist =
                        [ { rank = 1, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, challenger = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" } }
                        , { rank = 2, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, challenger = { id = "651fa006b15a534c69b119ef", nickname = "Dave" } }
                        ]

                    expectedChallengeResult =
                        [ { rank = 1
                          , player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        , { rank = 2
                          , player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        ]
                in
                Expect.equal (R.handleResult R.Undecided "651fa006b15a534c69b119ef" ranklist) expectedChallengeResult

        -- NOTE: Add any more tests to the bottom:
        , gotLowestRankTest
        , test "5. removes a rank for a given player id and re-sorts the ranks" <|
            \_ ->
                let
                    player1 =
                        { id = "1"
                        , nickname = "Player 1"
                        }

                    player2 =
                        { id = "2"
                        , nickname = "Player 2"
                        }

                    player3 =
                        { id = "3"
                        , nickname = "Player 3"
                        }

                    ranks =
                        [ { rank = 1, player = player1, challenger = player2 }
                        , { rank = 2, player = player2, challenger = player3 }
                        , { rank = 3, player = player3, challenger = player1 }
                        ]

                    expectedRanks =
                        [ { rank = 1, player = player2, challenger = player3 }
                        , { rank = 2, player = player3, challenger = player1 }
                        ]
                in
                R.removeRank "1" ranks
                    |> Expect.equal expectedRanks
        , test "6. removes a rank for a player in the middle of the list and re-sorts the ranks" <|
            \_ ->
                let
                    player1 =
                        { id = "1"
                        , nickname = "Player 1"
                        }

                    player2 =
                        { id = "2"
                        , nickname = "Player 2"
                        }

                    player3 =
                        { id = "3"
                        , nickname = "Player 3"
                        }

                    ranks =
                        [ { rank = 1, player = player1, challenger = player2 }
                        , { rank = 2, player = player2, challenger = player3 }
                        , { rank = 3, player = player3, challenger = player1 }
                        ]

                    expectedRanks =
                        [ { rank = 1, player = player1, challenger = player2 }
                        , { rank = 2, player = player3, challenger = player1 }
                        ]
                in
                R.removeRank "2" ranks
                    |> Expect.equal expectedRanks
        , test "7. removes a rank for a player at the end of the list" <|
            \_ ->
                let
                    player1 =
                        { id = "1"
                        , nickname = "Player 1"
                        }

                    player2 =
                        { id = "2"
                        , nickname = "Player 2"
                        }

                    player3 =
                        { id = "3"
                        , nickname = "Player 3"
                        }

                    ranks =
                        [ { rank = 1, player = player1, challenger = player2 }
                        , { rank = 2, player = player2, challenger = player3 }
                        , { rank = 3, player = player3, challenger = player1 }
                        ]

                    expectedRanks =
                        [ { rank = 1, player = player1, challenger = player2 }
                        , { rank = 2, player = player2, challenger = player3 }
                        ]
                in
                R.removeRank "3" ranks
                    |> Expect.equal expectedRanks
        , test "8. jsonUpdatedRanking" <|
            \_ ->
                let
                    ranking =
                        { id = "1"
                        , active = True
                        , name = "Ranking 1"
                        , owner_id = "2"
                        , baseaddress = { street = "Street 1", city = "City 1" }
                        , ladder = [ { rank = 1, player = { id = "3", nickname = "Player 3" }, challenger = { id = "4", nickname = "Player 4" } } ]
                        , player_count = 1
                        , owner_name = "Owner 1"
                        }

                    expected =
                        E.object
                            [ ( "id", E.string "1" )
                            , ( "active", E.bool True )
                            , ( "name", E.string "Ranking 1" )
                            , ( "owner_id", E.string "2" )
                            , ( "baseaddress", E.object [ ( "street", E.string "Street 1" ), ( "city", E.string "City 1" ) ] )
                            , ( "ladder", E.list R.encodeRank [ { rank = 1, player = { id = "3", nickname = "Player 3" }, challenger = { id = "4", nickname = "Player 4" } } ] )
                            , ( "owner_name", E.string "Owner 1" )
                            ]

                    encodedRanking =
                        E.encode 0 (R.jsonUpdatedRanking ranking)

                    decodedRanking =
                        D.decodeString D.value encodedRanking

                    expectedId =
                        "1"

                    actualId =
                        case decodedRanking of
                            Ok jsonValue ->
                                case D.decodeValue (D.field "id" D.string) jsonValue of
                                    Ok id ->
                                        id

                                    Err _ ->
                                        ""

                            Err _ ->
                                ""

                    expectedName =
                        "Ranking 1"

                    actualName =
                        case decodedRanking of
                            Ok jsonValue ->
                                case D.decodeValue (D.field "name" D.string) jsonValue of
                                    Ok name ->
                                        name

                                    Err _ ->
                                        ""

                            Err _ ->
                                ""
                in
                Expect.equal actualName expectedName
        , test "9. abandonSingleUserChallenge - when player id matches" <|
            \_ ->
                let
                    ranks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 3, player = { id = "4", nickname = "Player4" }, challenger = { id = "5", nickname = "Player5" } }
                        , { rank = 4, player = { id = "5", nickname = "Player5" }, challenger = { id = "4", nickname = "Player4" } }
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = "7", nickname = "Player7" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = "6", nickname = "Player6" } }
                        ]

                    expectedRanks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }

                        -- NOTE: Players 3 & 4 abandoned challenge
                        , { rank = 3, player = { id = "4", nickname = "Player4" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 4, player = { id = "5", nickname = "Player5" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }

                        -- NOTE: Players 6 & 7 not affected
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = "7", nickname = "Player7" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = "6", nickname = "Player6" } }
                        ]
                in
                Expect.equal (R.abandonSingleUserChallenge "4" ranks) expectedRanks
        , test "10. abandonSingleUserChallenge - when challenger id matches" <|
            \_ ->
                let
                    ranks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 3, player = { id = "4", nickname = "Player4" }, challenger = { id = "5", nickname = "Player5" } }
                        , { rank = 4, player = { id = "5", nickname = "Player5" }, challenger = { id = "4", nickname = "Player4" } }
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        ]

                    expectedRanks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 3, player = { id = "4", nickname = "Player4" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 4, player = { id = "5", nickname = "Player5" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        ]
                in
                Expect.equal (R.abandonSingleUserChallenge "5" ranks) expectedRanks
        , test "11. createSingleUserChallenge - when player id matches" <|
            \_ ->
                let
                    ranks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 3, player = { id = "4", nickname = "Player4" }, challenger = { id = "5", nickname = "Player5" } }
                        , { rank = 4, player = { id = "5", nickname = "Player5" }, challenger = { id = "4", nickname = "Player4" } }
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        ]

                    newChallenger =
                        { id = "3", nickname = "Player3" }

                    expectedRanks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = newChallenger }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = "1", nickname = "Player1" } }
                        , { rank = 3, player = { id = "4", nickname = "Player4" }, challenger = { id = "5", nickname = "Player5" } }
                        , { rank = 4, player = { id = "5", nickname = "Player5" }, challenger = { id = "4", nickname = "Player4" } }
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        ]
                in
                -- NOTE: "1" is the id of the player being challenged
                Expect.equal (R.createSingleUserChallenge "1" newChallenger ranks) expectedRanks
        , test "12. createSingleUserChallenge - when player id matches" <|
            \_ ->
                let
                    ranks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 3, player = { id = "4", nickname = "Player4" }, challenger = { id = "5", nickname = "Player5" } }
                        , { rank = 4, player = { id = "5", nickname = "Player5" }, challenger = { id = "4", nickname = "Player4" } }
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        ]

                    newChallenger =
                        { id = "7", nickname = "Player7" }

                    expectedRanks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = noChallenger }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = noChallenger }
                        , { rank = 3, player = { id = "4", nickname = "Player4" }, challenger = { id = "5", nickname = "Player5" } }
                        , { rank = 4, player = { id = "5", nickname = "Player5" }, challenger = { id = "4", nickname = "Player4" } }
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = "7", nickname = "Player7" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = "6", nickname = "Player6" } }
                        ]
                in
                -- NOTE: "6" is the id of the player being challenged
                Expect.equal (R.createSingleUserChallenge "6" newChallenger ranks) expectedRanks
        , test "13. createSingleUserChallenge - 6 ranks with changes in the middle" <|
            \_ ->
                let
                    ranks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 3, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 4, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        ]

                    newChallenger =
                        { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }

                    --{ challenger = { id = "6353e8b6aedf80653eb34191", nickname = "No Challenger" }, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, rank = 4 }
                    expectedRanks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = noChallenger }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = noChallenger }
                        , { rank = 3, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, challenger = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" } }
                        , { rank = 4, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, challenger = { id = "651fa006b15a534c69b119ef", nickname = "Dave" } }
                        , { rank = 5, player = { id = "6", nickname = "Player6" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        , { rank = 6, player = { id = "7", nickname = "Player7" }, challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" } }
                        ]
                in
                -- NOTE: "651fa006b15a534c69b119ef" is the id of the player being challenged
                Expect.equal (R.createSingleUserChallenge "651fa006b15a534c69b119ef" newChallenger ranks) expectedRanks
        , test "14. when there is a rank below" <|
            \_ ->
                let
                    ranks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = "2", nickname = "Player2" } }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = "4", nickname = "Player4" } }
                        , { rank = 3, player = { id = "5", nickname = "Player5" }, challenger = { id = "6", nickname = "Player6" } }
                        ]

                    rank =
                        { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = "2", nickname = "Player2" } }

                    expectedRankBelow =
                        Just { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = "4", nickname = "Player4" } }
                in
                Expect.equal (R.gotRankBelow rank ranks) expectedRankBelow
        , test "15. when there is no rank below" <|
            \_ ->
                let
                    ranks =
                        [ { rank = 1, player = { id = "1", nickname = "Player1" }, challenger = { id = "2", nickname = "Player2" } }
                        , { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = "4", nickname = "Player4" } }
                        ]

                    rank =
                        { rank = 2, player = { id = "3", nickname = "Player3" }, challenger = { id = "4", nickname = "Player4" } }
                in
                Expect.equal (R.gotRankBelow rank ranks) Nothing
        , test "16. handle user won" <|
            \_ ->
                let
                    ranklist =
                        [ { rank = 1, player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }, challenger = noChallenger }
                        , { rank = 2, player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }, challenger = noChallenger }
                        , { rank = 3, player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }, challenger = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" } }
                        , { rank = 4, player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }, challenger = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" } }
                        ]

                    expectedChallengeResultk5anonCurrent =
                        [ { rank = 1
                          , player = { id = "651fa006b15a534c69b119ef", nickname = "Dave" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        , { rank = 2
                          , player = { id = "652e2b3441c3decf3044f7c9", nickname = "Bobby" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        , { rank = 3
                          , player = { id = "655441c96eb7b94ec384a1d5", nickname = "k5anon" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        , { rank = 4
                          , player = { id = "655865e5fec6567140b1a9d7", nickname = "k6anon" }
                          , challenger = { id = Consts.noCurrentChallengerId, nickname = "No Challenger" }
                          }
                        ]
                in
                -- NOTE: The RESULT of the function being tested (userWon) is what comes AFTER 'Expect.equal' in the test output
                Expect.equal (R.userWon "655441c96eb7b94ec384a1d5" ranklist) expectedChallengeResultk5anonCurrent

            , test "17. should remove extra characters created by encoding from id" <|
            \_ ->
                let
                    id = E.string "62c66dc612296752b7c82cde"
                    newlyJoinedRanking = { id = id }
                    expected = "62c66dc612296752b7c82cde"
                in
                    R.newlyJoinedRankingIdAsValueManipulation newlyJoinedRanking
                    |> Expect.equal expected

            
        ]
