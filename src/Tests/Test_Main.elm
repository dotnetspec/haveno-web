module Tests.Test_Main exposing (tests)

import Expect
import Main exposing (only2Decimals)
import Test exposing (Test, describe, test)


tests : Test
tests =
    describe "only2Decimals"
        [ test "returns '0.00' when given '0.00'" <|
            \_ ->
                let
                    actual =
                        only2Decimals "0.00"
                in
                Expect.equal actual "0.00"
        , test "returns '42.94' when given '42.94967296'" <|
            \_ ->
                let
                    actual =
                        only2Decimals "42.94967296"
                in
                Expect.equal actual "42.94"
        , test "returns '42.95' when given '42.94999999'" <|
            \_ ->
                let
                    actual =
                        only2Decimals "42.94999999"
                in
                -- NOTE: The value isn't rounded. It's just to 2 decimal places.
                Expect.equal actual "42.94"
        , test "returns '42.9' when given '42.9'" <|
            \_ ->
                let
                    actual =
                        only2Decimals "42.9"
                in
                Expect.equal actual "42.9"
        , test "returns '42' when given '42'" <|
            \_ ->
                let
                    actual =
                        only2Decimals "42"
                in
                Expect.equal actual "42"
        ]
