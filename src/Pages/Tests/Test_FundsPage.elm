module Pages.Tests.Test_FundsPage exposing (..)

import Expect
import Extras.Constants exposing (xmrConversionConstant)
import Fuzz
import Pages.Funds exposing (formatXmrBalance)
import Test exposing (Test, describe, fuzz2, test)
import UInt64


tests : Test
tests =
    describe "formatXmrBalance function with fuzz testing"
        [ fuzz2 (Fuzz.intRange 0 7000) (Fuzz.intRange 0 2147483647) "formats realistic XMR balances correctly" <|
            \higher lower ->
                let
                    balance =
                        { higher = higher, lower = lower }

                    actual =
                        formatXmrBalance balance

                    -- Compute expected value manually
                    fullUInt64 =
                        UInt64.add (UInt64.mul (UInt64.fromInt higher) (UInt64.fromInt xmrConversionConstant))
                            (UInt64.fromInt lower)

                    expected =
                        fullUInt64
                            |> UInt64.toFloat
                            |> (\x -> x / 1000000000000)
                            |> (\x -> toFloat (round (x * 10 ^ 11)) / 10 ^ 11)
                            |> String.fromFloat
                in
                Expect.equal actual expected
        , test "formats 449917 higher and -542150938 lower correctly" <|
            \_ ->
                let
                    balance =
                        { higher = 449917, lower = -542150938 }

                    actual =
                        formatXmrBalance balance
                in
                Expect.equal actual "1932.38255373079"
        ]
