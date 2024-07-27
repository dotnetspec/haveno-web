-- NOTE: Use this module rather than within e.g. a User module cos can be used across modules.
-- User expressions like isValid4-8Chars instead of e.g. isValidName cos more
-- generic and easier to maintain


module Utils.Validation.Validate exposing
    ( is20CharMax
    , isEmailValid
    , isMobileValid
    , isValid4to8Chars
    , isValid4to20Chars
    , isValidRankingId
    , validatedMaxTextLength
    )

import Char
import Parser exposing (..)
import Regex
import Set


isValid4to8Chars : String -> Bool
isValid4to8Chars str =
    Regex.contains (Maybe.withDefault Regex.never (Regex.fromString "(?!.*[\\.\\-\\_]{2,})^[a-zA-Z0-9\\.\\-\\_]{4,8}$")) str

isValid4to20Chars : String -> Bool
isValid4to20Chars str =
    Regex.contains (Maybe.withDefault Regex.never (Regex.fromString "(?!.*[\\.\\-\\_]{2,})^[a-zA-Z0-9\\.\\-\\_]{4,20}$")) str


is20CharMax : String -> Bool
is20CharMax str =
    if String.length str <= 20 then
        True

    else
        False



-- RF: invalid email: lll@l.clkjljljljljljlkjljljljljlkl possible


isEmailValid : String -> Bool
isEmailValid newEmail =
    Regex.contains
        (Maybe.withDefault Regex.never
            (Regex.fromString "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
        )
        newEmail


isMobileValid : String -> Bool
isMobileValid newMobile =
    if newMobile == "" then
        True

    else
        Regex.contains
            (Maybe.withDefault Regex.never
                (Regex.fromString "^\\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\\W*\\d){0,13}\\d$")
            )
            newMobile



-- REVIEW: What is this?


validatedMaxTextLength : String -> Int -> String
validatedMaxTextLength str maxLength =
    if String.length str > maxLength then
        String.dropRight 1 str

    else
        str



--there is a small degree of flexibility (+/- 4 chars) to account for server changes


isValidRankingId : String -> Bool
isValidRankingId str =
    let
        result =
            run rankingIdVar str
    in
    case result of
        Ok a ->
            --if String.length a > 20 && String.length (validatedMaxTextLength a 24) < 25 then
            if String.length a == 24 then
                True

            else
                False

        Err _ ->
            False


rankingIdVar : Parser String
rankingIdVar =
    variable
        { start = Char.isAlphaNum

        --, inner = \c -> Char.isAlphaNum c || c == '_'
        , inner = \c -> Char.isAlphaNum c

        --, reserved = Set.fromList [ "let", "in", "case", "of" ]
        , reserved = Set.fromList [ "" ]
        }
