module Pages.Dashboard exposing (Dashboard(..), Model, Msg, Status(..), init, update, view)

{-| The Dashboardpage. You can get here via either the / or /#/ routes.
-}

import Grpc
import Html exposing (Html)
import Html.Attributes as Attr
import Proto.Io.Haveno.Protobuffer as Protobuf
import Types.DateType exposing (DateTime)



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
    , version : String
    , errors : List String
    }



-- Define your initialModel with default values


type Dashboard
    = Dashboard
        { name : String
        }


type Status
    = Loading
    | Errored



{- -- NOTE: by calling (from Main) Tuple.first (Dashboard.init ()) , we’ll end up with
   the Dashboard.Model value we seek. () means we don't really care what goes in, we just
   want the output (in this case the model (slightly modified))
-}
-- NAV: Init


init : FromMainToDashboard -> ( Model, Cmd Msg )
init fromMainToDashboard =
    let
        newModel =
            Model Loading "Dashboard" (Dashboard { name = "Loading..." }) Nothing "" fromMainToDashboard.havenoVersion []
    in
    ( newModel
      --, Cmd.batch [ Comms.CustomGrpc.gotPrimaryAddress |> Grpc.toCmd GotXmrPrimaryAddress, Comms.CustomGrpc.gotAvailableBalances |> Grpc.toCmd BalanceResponse ]
    , Cmd.none
    )


type Msg
    = GotXmrPrimaryAddress (Result Grpc.Error Protobuf.GetXmrPrimaryAddressReply)



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            ( { model | primaryaddress = primaryAddresponse.primaryAddress, status = Loading }, Cmd.none )

        GotXmrPrimaryAddress (Err _) ->
            ( { model | status = Errored }, Cmd.none )



-- NAV: View


view : Model -> Html Msg
view model =
    case model.status of
        Loading ->
            Html.div
                [ Attr.class "split-col"
                , Attr.class "spinner"
                ]
                []

        Errored ->
            Html.div
                [ Attr.class "split-col"
                , Attr.class "error"
                ]
                [ Html.text "Error on Loading" ]



-- NAV: Type Aliases


type alias FromMainToDashboard =
    { time : Maybe DateTime
    , havenoVersion : String
    }
