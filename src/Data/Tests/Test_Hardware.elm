module Data.Tests.Test_Hardware exposing (..)

import Char exposing (isAlphaNum)
import Data.Hardware exposing (validXMRAddressParser)
import Expect
import Fuzz exposing (Fuzzer)
import Parser exposing (run)
import Test exposing (..)
import Extras.TestData as TestData


tests : Test
tests =
    describe "Hardware tests"
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
                    TestData.subAddress
            in
            case parseValidXMRAddressKey xmrAddress of
                Ok _ ->
                    Expect.equal True True

                Err _ ->
                    Expect.equal True False
