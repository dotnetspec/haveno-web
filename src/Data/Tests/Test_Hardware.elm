module Data.Tests.Test_Hardware exposing (..)

import Char exposing (isAlphaNum)
import Data.Hardware as R exposing (Player, Rank, Ranking, gotLowestRank, validXMRAddressParser)
import Data.User as U exposing (..)
import Expect
import Extras.Constants as Consts
import Fuzz exposing (Fuzzer, char, intRange, list, string)
import Json.Decode as D
import Json.Encode as E
import Parser exposing ((|.), Parser, andThen, chompWhile, end, getChompedString, map, run, succeed)
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
        [ fuzzTestValidXMRAddressParser
        , simpleTestValidXMRAddress
        ]


parseValidXMRAddressKey : String -> Result (List Parser.DeadEnd) String
parseValidXMRAddressKey input =
    run validXMRAddressParser input


alphanumericChar : Fuzzer Char
alphanumericChar =
    Fuzz.intRange 48 122
        |> Fuzz.map Char.fromCode
        |> Fuzz.filter isAlphaNum


alphanumericString : Int -> Fuzzer String
alphanumericString len =
    Fuzz.listOfLength len alphanumericChar
        |> Fuzz.map String.fromList


fuzzTestValidXMRAddressParser : Test
fuzzTestValidXMRAddressParser =
    describe "Fuzz test for validXMRAddressParser"
        [ fuzz (alphanumericString 95) "should match valid 95-character alphanumeric strings" <|
            \str ->
                case parseValidXMRAddressKey str of
                    Ok _ ->
                        Expect.equal True True

                    Err _ ->
                        Expect.equal True False
        , fuzz (alphanumericString 94) "should not match 94-character alphanumeric strings" <|
            \str ->
                case parseValidXMRAddressKey str of
                    Ok _ ->
                        Expect.equal True False

                    Err _ ->
                        Expect.equal True True
        , fuzz (alphanumericString 96) "should not match 96-character alphanumeric strings" <|
            \str ->
                case parseValidXMRAddressKey str of
                    Ok _ ->
                        Expect.equal True False

                    Err _ ->
                        Expect.equal True True
        , test "should not match empty string" <|
            \_ ->
                case parseValidXMRAddressKey "" of
                    Ok _ ->
                        Expect.equal True False

                    Err _ ->
                        Expect.equal True True
        ]



-- New unit test for the specific XMR address


simpleTestValidXMRAddress : Test
simpleTestValidXMRAddress =
    test "Valid XMR address should be parsed successfully" <|
        \() ->
            let
                xmrAddress =
                    "BceiPLaX7YDevCfKvgXFq8Tk1BGkQvtfAWCWJGgZfb6kBju1rDUCPzfDbHmffHMC5AZ6TxbgVVkyDFAnD2AVzLNp37DFz32"
            in
            case parseValidXMRAddressKey xmrAddress of
                Ok _ ->
                    Expect.equal True True

                Err _ ->
                    Expect.equal True False
