module Data.Account exposing (Model, Msg, init, update, view)

import Html exposing (Html, button, div, text, input)
import Html.Events exposing (onClick, onInput)
import Json.Decode as Decode

-- MODEL

type alias Model =
    { accountId : String
    , accountExists : Maybe Bool
    }

init : Model
init =
    { accountId = ""
    , accountExists = Nothing }

-- UPDATE

type Msg
    = UpdateAccountId String
    | CheckAccountExists
    | AccountExistsChecked (Result Decode.Error Bool)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        UpdateAccountId accountId ->
            ( { model | accountId = accountId }, Cmd.none )

        CheckAccountExists ->
            -- HACK: Cmd.none
            ( model, Cmd.none)

        AccountExistsChecked (Ok exists) ->
            ( { model | accountExists = Just exists }, Cmd.none )

        AccountExistsChecked (Err _) ->
            ( { model | accountExists = Nothing }, Cmd.none )

-- VIEW

view : Model -> Html Msg
view model =
    div []
        [ input [ onInput UpdateAccountId ] []
        , button [ onClick CheckAccountExists ] [ text "Check Account Exists" ]
        -- HACK
        , div [] [ text <| "Account Exists: " ++ "model.accountExists" ]
        ]
