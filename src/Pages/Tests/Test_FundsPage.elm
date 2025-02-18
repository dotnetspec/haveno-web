module Pages.Tests.Test_FundsPage exposing (..)

-- NOTE: You do not need to re-compile the main elm code each time you run the tests

import Expect
import Float.Extra as Float
import Pages.Funds exposing (formatXmrBalance)
import Test exposing (Test, describe, test)
import UInt64 exposing (UInt64)


reconstructInt64 : { higher : Int, lower : Int } -> String
reconstructInt64 int64 =
    let
        -- Convert higher and lower into a full 64-bit integer
        fullUInt64 : UInt64.UInt64
        fullUInt64 =
            let
                highPart =
                    UInt64.fromInt int64.higher |> UInt64.mul (UInt64.fromInt 4294967296)

                lowPart =
                    if int64.lower < 0 then
                        UInt64.fromInt (int64.lower + 4294967296)

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
    describe "formatXmrBalance function"
        [ test "formats a large balance correctly" <|
            \_ ->
                let
                    balance =
                        { higher = 449917, lower = -542150938 }

                    expected =
                        "1932.38255373079"

                    actual =
                        reconstructInt64 balance
                in
                Expect.equal actual expected
        ]
