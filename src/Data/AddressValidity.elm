module Data.AddressValidity exposing (validXMRAddressParser)

import Char exposing (isAlphaNum)
import Parser exposing (Parser, chompWhile, end, getChompedString)


validXMRAddressParser : Parser String
validXMRAddressParser =
    getChompedString (chompWhile isAlphaNum)
        |> Parser.andThen
            (\str ->
                if String.length str == 95 then
                    Parser.succeed str

                else
                    Parser.problem "Invalid length"
            )
        |> Parser.andThen
            (\str ->
                end
                    |> Parser.map (\_ -> str)
            )
