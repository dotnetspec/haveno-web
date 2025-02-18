module Pages.Tests.Test_FundsPage exposing (..)

import Expect
import Test exposing (Test, describe, fuzz2)
import Fuzz
import UInt64
import Extras.Constants exposing (xmrConversionConstant)




formatXmrBalance : { higher : Int, lower : Int } -> String
formatXmrBalance int64 =
    let
        -- Convert higher and lower into a full 64-bit integer
        fullUInt64 : UInt64.UInt64
        fullUInt64 =
            let
                highPart =
                    UInt64.fromInt int64.higher |> UInt64.mul (UInt64.fromInt xmrConversionConstant)

                lowPart =
                    if int64.lower < 0 then
                        UInt64.fromInt (int64.lower + xmrConversionConstant)

                    else
                        UInt64.fromInt int64.lower
            in
            UInt64.add highPart lowPart

        -- Convert UInt64 to Float
        fullFloat : Float
        fullFloat =
            UInt64.toFloat fullUInt64

        -- Convert piconero to XMR
        xmrAmount : Float
        xmrAmount =
            fullFloat / 1000000000000

        -- Ensure proper rounding to 11 decimal places
        scale : Float
        scale =
            toFloat (10 ^ 11)

        roundedXmr : Float
        roundedXmr =
            toFloat (round (xmrAmount * scale)) / scale
    in
    String.fromFloat roundedXmr


tests : Test
tests =
    describe "formatXmrBalance function with fuzz testing"
        [ fuzz2 (Fuzz.intRange 0 7000) (Fuzz.intRange 0 2147483647) "formats realistic XMR balances correctly" <|
            \higher lower ->
                let
                    balance = { higher = higher, lower = lower }
                    actual = formatXmrBalance balance

                    -- Compute expected value manually
                    fullUInt64 = UInt64.add (UInt64.mul (UInt64.fromInt higher) (UInt64.fromInt xmrConversionConstant))
                                            (UInt64.fromInt lower)

                    expected =
                        fullUInt64
                            |> UInt64.toFloat
                            |> (\x -> x / 1000000000000)
                            |> (\x -> toFloat (round (x * 10^11)) / 10^11)
                            |> String.fromFloat
                in
                Expect.equal actual expected
        ]
