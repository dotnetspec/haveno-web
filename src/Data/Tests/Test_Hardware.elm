module Data.Tests.Test_Hardware exposing (..)

import Data.Hardware as R exposing (Player, Rank, Ranking, gotLowestRank)
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
        
        -- NOTE: Add any more tests to the bottom:
        , gotLowestRankTest
        
                    
        ]
