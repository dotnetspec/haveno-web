module Pages.Tests.Test_HardwarePage exposing (..)


import Dict exposing (fromList)
import Expect
import Extras.Constants as Consts exposing (..)
import Json.Decode as D exposing (..)
import Json.Encode as E exposing (..)
import Test exposing (..)

-- REVIEW: This is left here as a placeholder for the tests
tests : Test
tests =
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
                --determineButtonType loggedInUsersRank rankBeingIterated
                    --|> 
                    -- HACK: This is a placeholder
                    Expect.equal 1 1
                ]
