module Pages.Dashboard exposing (Model, Msg, init, initialModel, update, view)

{-| The Dashboardpage. You can get here via either the / or /#/ routes.
-}

import Buttons.Default exposing (defaultButton)
import Debug exposing (log)
import Element exposing (Element, el)
import Element.Font as Font
import Element.Input as Input
import Extras.Constants as Consts
import Framework
import Framework.Button as Button
import Framework.Card as Card
import Framework.Color as Color
import Framework.Grid as Grid
import Framework.Heading as Heading
import Framework.Input as Input
import Grpc exposing (..)
import Html exposing (..)
import Html.Attributes as Attr exposing (..)
import Http exposing (..)
import Json.Decode as D exposing (..)
import Json.Decode.Pipeline exposing (optional, required)
import Json.Encode as E exposing (..)
import Maybe exposing (withDefault)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (..)
import Proto.Io.Haveno.Protobuffer.GetVersion exposing (getVersion)
import Spec.Markup exposing (log)
import Types.DateType as DateType exposing (DateTime(..))
import Url exposing (Protocol(..), Url)



--import Widget.Material.Typography exposing (h2)
{- -- NOTE: The Model will contain all the data relevant to this kind of page. If this page,
   or a similar one became more sophisticated, you would start modelling it's data here. If things
   start getting tricky (lots of difficult changes to existing code), ask yourself if you need a similar,
   but different, data structure (e.g. Page AND Route)
-}
-- NAV: Model


type alias Model =
    { status : Status
    , pagetitle : String
    , root : Dashboard
    , balance : String
    , flagUrl : Url
    , havenoAPKHttpRequest : Maybe HavenoAPKHttpRequest
    , version : Maybe GetVersionReply
    , errors : List String
    }



-- Define your initialModel with default values


initialModel : Model
initialModel =
    { status = Loaded
    , pagetitle = "Dashboard"
    , root = Dashboard { name = "Loading..." }
    , balance = "0.00"
    , flagUrl = Url Http "localhost" Nothing "/dashboard" Nothing Nothing
    , havenoAPKHttpRequest = Nothing
    , version = Nothing
    , errors = []
    }


type Dashboard
    = Dashboard
        { name : String
        }


type Status
    = Loading
    | Loaded
    | Errored



-- | Loaded
-- | Errored
{- -- NOTE: by calling (from Main) Tuple.first (Dashboard.init ()) , we’ll end up with
   the Dashboard.Model value we seek. () means we don't really care what goes in, we just
   want the output (in this case the model (slightly modified))
-}
-- NAV: Init


init : FromMainToDashboard -> ( Model, Cmd Msg )
init fromMainToDashboard =
    let
        newUrl =
            Url Http "localhost" Nothing "/dashboard" Nothing Nothing

        newModel =
            Model Loaded "Dashboard" (Dashboard { name = "Loading..." }) "0.00" newUrl Nothing Nothing []
    in
    ( newModel
    , Cmd.none
    )


type Msg
    = GotInitialModel Model
    | BalanceResponse (Result Http.Error SuccessfullBalanceResult)
    | GotVersion (Result Grpc.Error GetVersionReply)



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        {- -- NOTE: This was originally setup to work with an Http Result (branch on OK and Err)
           but we're just handling the initialModel - not really doing much
        -}
        GotVersion (Ok versionResp) ->
            ( { model | version = Just versionResp }, Cmd.none )

        GotVersion (Err _) ->
            ( { model | version = model.version }, Cmd.none )

        GotInitialModel newModel ->
            ( { newModel | pagetitle = model.pagetitle }, Cmd.none )

        BalanceResponse (Ok auth) ->
            let
                headers =
                    -- NOTE: the 'Zoho-oauthtoken' sent at this point is the access token received after refresh
                    [ Http.header "Authorization" ("Bearer " ++ withDefault "No access token 2" (Just auth.deployment_model)) ]

                -- incorporate new header with access token and update middleware port
                flagUrlWithMongoDBMWAndPortUpdate =
                    if String.contains Consts.localorproductionServerAutoCheck model.flagUrl.host then
                        Url.toString <| Url model.flagUrl.protocol model.flagUrl.host Nothing Consts.middleWarePath Nothing Nothing

                    else
                        Url.toString <| Url.Url model.flagUrl.protocol model.flagUrl.host (Just 3000) Consts.middleWarePath Nothing Nothing

                newHttpParams =
                    HavenoAPKHttpRequest Consts.get headers flagUrlWithMongoDBMWAndPortUpdate Http.emptyBody Nothing Nothing

                {- apiSpecs =
                   model.apiSpecifics
                -}
                -- HACK:
                newModel =
                    { model
                        | havenoAPKHttpRequest = Just newHttpParams

                        --, queryType = LoggedInUser
                    }
            in
            ( newModel
            , -- NOTE: if you want to run a function based on the response can here:
              Cmd.none
              --loginRequest newModel
              --sendPostDataToMongoDBMW newModel
            )

        BalanceResponse (Err responseErr) ->
            let
                respErr =
                    Consts.httpErrorToString responseErr

                {- apiSpecs =
                       model.apiSpecifics

                   newapiSpecs =
                       { apiSpecs | accessToken = Nothing }
                -}
            in
            ( { model | errors = model.errors ++ [ respErr ] }
            , Cmd.none
            )



-- NAV: View


view : Model -> Html Msg
view model =
    Framework.responsiveLayout [] <|
        Element.column Framework.container <|
            [ Element.el Heading.h1 <|
                Element.text "Haveno Web - Dashboard"
            , Element.text "\n"
            , Element.text "Your version is:"
            , Element.el Heading.h4 <| Element.text (Maybe.withDefault "" (model.version |> Maybe.map .version))
            , Element.text "\n"
            , case model.errors of
                [] ->
                    Element.text ""

                _ ->
                    Element.column Grid.section <|
                        List.map (\error -> Element.el Heading.h6 (Element.text error)) model.errors
            ]



-- NAV: Type Aliases


type alias SuccessfullBalanceResult =
    { deployment_model : String
    , location : String
    , hostname : String
    , ws_hostname : String
    }


type alias FromMainToDashboard =
    { time : Maybe DateTime
    , flagUrl : Url.Url
    }


type alias HavenoAPKHttpRequest =
    { method : String
    , headers : List Header
    , url : String
    , body : Body
    , timeout : Maybe Float
    , tracker : Maybe String
    }



-- NAV: Http requests
-- Function to create the GetVersionRequest
-- NAV: Http requests
-- Function to create the GetVersionRequest
-- Function to make the HTTP request
-- NAV: Json Decoders


versionDecoder : Decoder String
versionDecoder =
    field "version" D.string


balanceDecoder : Decoder SuccessfullBalanceResult
balanceDecoder =
    D.map4 SuccessfullBalanceResult
        (field "deployment_model" D.string)
        (field "location" D.string)
        (field "hostname" D.string)
        (field "ws_hostname" D.string)
