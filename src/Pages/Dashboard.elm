module Pages.Dashboard exposing (Model, Msg, init, initialModel, update, view)

{-| The Dashboardpage. You can get here via either the / or /#/ routes.
-}

import Buttons.Default exposing (defaultButton)
import Extras.Constants as Consts
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
import Types.DateType as DateType exposing (DateTime(..))
import Url exposing (Protocol(..), Url)



{- -- NOTE: The Model will contain all the data relevant to this kind of page. If this page,
   or a similar one became more sophisticated, you would start modelling it's data here. If things
   start getting tricky (lots of difficult changes to existing code), ask yourself if you need a similar,
   but different, data structure (e.g. Page AND Route)
-}
-- NAV: Model


type alias Model =
    { status : Status
    , title : String
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
    { status = Loading
    , title = "Dashboard"
    , root = Dashboard { name = "Loading..." }
    , balance = "0.00"
    , flagUrl = Url Https "example.com" Nothing "" Nothing Nothing
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
        -- REVIEW: Not yet clear how/if this will be used here
        devOrProdServer =
            if String.contains Consts.localorproductionServerAutoCheck fromMainToDashboard.flagUrl.host then
                Url fromMainToDashboard.flagUrl.protocol fromMainToDashboard.flagUrl.host Nothing Consts.productionProxyConfig Nothing Nothing

            else
                Url fromMainToDashboard.flagUrl.protocol fromMainToDashboard.flagUrl.host (Just 3000) Consts.middleWarePath Nothing Nothing

        newModel =
            Model Loading "Haveno-Web Dashboard" (Dashboard { name = "Loading..." }) "0.00" fromMainToDashboard.flagUrl (Just (HavenoAPKHttpRequest Consts.post [] "" Http.emptyBody Nothing Nothing)) Nothing []
    in
    ( newModel
    , sendVersionRequest {}
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
            ( { newModel | title = model.title }, Cmd.none )

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
-- NOTE: Our view will be Html msg, not Document
-- as we won't use 'title' etc. cos we have our own formatting


view : Model -> Html msg
view model =
    section [ Attr.id "page", class "section-background" ]
        [ div [ class "container container--narrow" ]
            [ h1 [ classList [ ( "text-center", True ), ( "Dashboard", True ) ] ]
                [ text "Haveno Web - Dashboard" ]
            , h2 [ class "text-center" ]
                [ text "Online Dex" ]
            , div []
                [ div [ class "text-center" ]
                    [ text "Welcome to Haveno Web, the online decentralized exchange for Haveno, the private, untraceable cryptocurrency."
                    ]
                ]
            , div []
                [ div [ class "text-center" ]
                    [ text "Your version is:"
                    ]
                ]
            -- HACK: This doesn't account for the LNX currently
            , div []
                [ div [ class "text-center" ]
                    [ text "Nano S Connected"
                    ]
                ]
            , div []
                [ div [ class "text-center" ]
                    [ text (Maybe.withDefault "" (model.version |> Maybe.map .version))
                    ]
                ]
            ]
        ]



-- NAV: Type Aliases


type alias SuccessfullVersion =
    { version : String }


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


sendVersionRequest : GetVersionRequest -> Cmd Msg
sendVersionRequest request =
    let
        grpcRequest =
            Grpc.new getVersion request
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotVersion grpcRequest



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
