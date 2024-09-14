module Data.Tests.Test_User exposing (suite)

import Data.User exposing (User(..))
import Data.Hardware exposing (Ranking)
import Expect
import Test exposing (Test, describe, test)
import Json.Decode as D exposing (..)

import Json.Encode as E exposing (..)


suite : Test
suite =
    describe "Test_User suite"
        [ test "1. PLACEHOLDER - NOT IN USE - userInfo decode" <|
            \_ ->
                let
                    {- userInfo = Data.User.emptyUserInfo
                        

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
                                "" -}

                    expectedName =
                        "Ranking 1"

                    actualName = "Ranking 1"
                        {- case decodedRanking of
                            Ok jsonValue ->
                                case D.decodeValue (D.field "name" D.string) jsonValue of
                                    Ok name ->
                                        name

                                    Err _ ->
                                        ""

                            Err _ -> 
                                ""-}
                in
                Expect.equal actualName expectedName ]