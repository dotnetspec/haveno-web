module Pages.Donate exposing (..)

import Buttons.Default exposing (defaultButton)
import Debug exposing (log)
import Extras.Constants as Consts exposing (donationAddress)
import Grpc exposing (..)
import Html exposing (Html, div, section, text)
import Html.Attributes as Attr exposing (class, id)
import Html.Events
import Http exposing (..)
import Json.Encode as E exposing (..)
import Maybe exposing (withDefault)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (..)
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets
import Protobuf.Types.Int64 exposing (toInts)
import Spec.Markup exposing (log)
import Types.DateType as DateType exposing (DateTime(..))
import UInt64 exposing (UInt64)
import UInt64.Digits exposing (Digits)
import Url exposing (Protocol(..), Url)
import Utils.MyUtils as MyUtils



-- NAV: Model


type alias Model =
    { status : Status
    , pagetitle : String
    , balances : Maybe Protobuf.BalancesInfo
    , isAddressVisible : Bool
    , primaryaddress : String
    , errors : List String
    , subaddress : String
    , currentView : View
    }


initialModel : Model
initialModel =
    { status = Loaded
    , pagetitle = "Donate"
    , balances = Just Protobuf.defaultBalancesInfo
    , isAddressVisible = False
    , primaryaddress = ""
    , errors = []
    , subaddress = ""
    , currentView = DonateView
    }


type Status
    = Loading
    | Loaded
    | Errored


type View
    = DonateView
    | ErrorView
    | ManageDonateView



-- NAV: Init


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel
    , Cmd.none
    )



-- NAV: Msg


type Msg
    = GotBalances (Result Grpc.Error Protobuf.GetBalancesReply)
    | GotXmrPrimaryAddress (Result Grpc.Error Protobuf.GetXmrPrimaryAddressReply)
    | GotXmrNewSubaddress (Result Grpc.Error Protobuf.GetXmrNewSubaddressReply)
    | AddNewAccount
    | ChangeView View
    | ToggleVisibility



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleVisibility ->
            ( { model | isAddressVisible = not model.isAddressVisible }, Cmd.none )

        AddNewAccount ->
            ( { model | currentView = ManageDonateView }, Cmd.none )

        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            ( { model | primaryaddress = primaryAddresponse.primaryAddress, status = Loaded, currentView = DonateView }, Cmd.none )

        GotXmrPrimaryAddress (Err error) ->
            ( { model | status = Errored }, Cmd.none )

        GotXmrNewSubaddress (Ok subAddresponse) ->
            ( { model | subaddress = subAddresponse.subaddress, status = Loaded, currentView = ManageDonateView }, Cmd.none )

        GotXmrNewSubaddress (Err error) ->
            ( { model | status = Errored }, Cmd.none )

        GotBalances (Ok response) ->
            ( { model | balances = response.balances, status = Loaded }, Cmd.none )

        GotBalances (Err error) ->
            ( { model | status = Errored }, Cmd.none )

        ChangeView uiView ->
            ( { model | currentView = uiView }, Cmd.none )



-- NAV: View


view : Model -> Html Msg
view model =
    section
        [ Attr.id "page"
        , class "section-background"
        , class "text-center"
        ]
        [ div [ class "split" ]
            [ div
                [ class "split-col"
                ]
                []
            , case model.status of
                Loading ->
                    div
                        []
                        [ div
                            [ class "spinner"
                            ]
                            []
                        ]

                Errored ->
                    div [ class "split-col" ] [ errorView ]

                Loaded ->
                    div
                        [ class "split-col"
                        ]
                        [ case model.currentView of
                            DonateView ->
                                manageDonateView

                            ManageDonateView ->
                                manageDonateView

                            ErrorView ->
                                manageDonateView
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]



-- NAV: View helpers:


custodialDonateView : Model -> Html Msg
custodialDonateView model =
    Html.div [ Attr.class "accounts-container", Attr.id "custodialDonateView" ]
        [ Html.h1 [ Attr.class "accounts-title" ] [ Html.text "Donate" ]
        , Html.button [ class "info-button", Html.Events.onClick AddNewAccount, Attr.id "addnewaccountbutton" ] [ text "Add New Account" ]
        ]


errorView : Html Msg
errorView =
    Html.div [ Attr.class "accounts-container" ]
        [ Html.h1 [ Attr.class "accounts-title" ] [ Html.text "Donate" ]
        , Html.div [ Attr.class "error-message", Attr.id "accounts-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]


manageDonateView : Html Msg
manageDonateView =
    Html.div [ Attr.class "accounts-container" ]
        [ Html.h1 [ Attr.class "accounts-title" ] [ Html.text "Donate" ]
        , Html.div [ Attr.class "address-text" ]
            [ Html.text ("Thank you for your support. Every bit helps. Please send your donation to: " ) ]
            , Html.p [Attr.id "donationaddress"][ Html.text (Consts.donationAddress ) ]
        ]



-- NAV: gRPC calls


gotAvailableBalances : Cmd Msg
gotAvailableBalances =
    let
        grpcRequest =
            Grpc.new Wallets.getBalances Protobuf.defaultGetBalancesRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotBalances grpcRequest


gotNewPrimaryAddress : Cmd Msg
gotNewPrimaryAddress =
    let
        grpcRequest =
            Grpc.new Wallets.getXmrPrimaryAddress Protobuf.defaultGetXmrPrimaryAddressRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotXmrPrimaryAddress grpcRequest


gotNewSubAddress : Cmd Msg
gotNewSubAddress =
    let
        grpcRequest =
            Grpc.new Wallets.getXmrNewSubaddress Protobuf.defaultGetXmrNewSubaddressRequest
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotXmrNewSubaddress grpcRequest



-- NAV: Helper functions


