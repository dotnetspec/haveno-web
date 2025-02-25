module Pages.Dashboard exposing (Model, Msg, init, initialModel, update, view)

{-| The Dashboardpage. You can get here via either the / or /#/ routes.
-}

--import Html exposing (..)
--import Html.Attributes as Attr exposing (..)

import Comms.CustomGrpc
import Element
import Element.Region as Region
import Framework
import Framework.Grid as Grid
import Framework.Heading as Heading
import Grpc
import Html exposing (Html)
import Html.Attributes as Attr
import Http exposing (..)
import Proto.Io.Haveno.Protobuffer as Protobuf
import Types.DateType exposing (DateTime)
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
    , balances : Maybe Protobuf.BalancesInfo
    , primaryaddress : String
    , flagUrl : Url
    , havenoAPKHttpRequest : Maybe HavenoAPKHttpRequest
    , version : String
    , errors : List String
    }



-- Define your initialModel with default values


initialModel : Model
initialModel =
    { status = Loading
    , pagetitle = "Dashboard"
    , root = Dashboard { name = "Loading..." }
    , balances = Nothing
    , primaryaddress = ""
    , flagUrl = Url Http "localhost" Nothing "/dashboard" Nothing Nothing
    , havenoAPKHttpRequest = Nothing
    , version = "No Haveno version available"
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
            Model Loaded "Dashboard" (Dashboard { name = "Loading..." }) Nothing "" newUrl Nothing fromMainToDashboard.havenoVersion []
    in
    ( newModel
    , Cmd.batch [ Comms.CustomGrpc.gotPrimaryAddress |> Grpc.toCmd GotXmrPrimaryAddress, Comms.CustomGrpc.gotAvailableBalances |> Grpc.toCmd BalanceResponse ]
    )


type Msg
    = BalanceResponse (Result Grpc.Error Protobuf.GetBalancesReply)
    | GotXmrPrimaryAddress (Result Grpc.Error Protobuf.GetXmrPrimaryAddressReply)



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        BalanceResponse (Ok response) ->
            ( { model | balances = response.balances, status = Loaded }, Cmd.none )

        BalanceResponse (Err error) ->
            ( { model | status = Errored }, Cmd.none )

        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            ( { model | primaryaddress = primaryAddresponse.primaryAddress, status = Loaded }, Cmd.none )

        GotXmrPrimaryAddress (Err error) ->
            ( { model | status = Errored }, Cmd.none )



-- NAV: View


view : Model -> Html Msg
view model =
    Framework.responsiveLayout [] <|
        Element.column Framework.container <|
            [ Element.el Heading.h1 <|
                Element.text "Dashboard"
            , Element.text "\n"
            , Element.el [ Region.heading 4, Element.htmlAttribute (Attr.id "versiondisplay") ]
                (Element.text ("Your version is: " ++ model.version))
            , Element.text "\n"
            , case model.errors of
                [] ->
                    Element.text ""

                _ ->
                    Element.column Grid.section <|
                        List.map (\error -> Element.el Heading.h6 (Element.text error)) model.errors
            ]



-- NAV: Type Aliases


type alias FromMainToDashboard =
    { time : Maybe DateTime
    , havenoVersion : String
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
