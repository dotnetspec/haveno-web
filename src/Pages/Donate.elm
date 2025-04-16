module Pages.Donate exposing (Model, Msg(..), Status(..), View(..), errorView, gotAvailableBalances, gotNewSubAddress, gotPrimaryAddress, init, initialModel, manageDonateView, update, view)

import Grpc
import Html exposing (Html, div, section)
import Html.Attributes as Attr exposing (class)
import Proto.Io.Haveno.Protobuffer as Protobuf
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets



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
    = Loaded
    | Errored


type View
    = DonateView
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



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotXmrPrimaryAddress (Ok primaryAddresponse) ->
            ( { model | primaryaddress = primaryAddresponse.primaryAddress, status = Loaded, currentView = DonateView }, Cmd.none )

        GotXmrPrimaryAddress (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        GotXmrNewSubaddress (Ok subAddresponse) ->
            ( { model | subaddress = subAddresponse.subaddress, status = Loaded, currentView = ManageDonateView }, Cmd.none )

        GotXmrNewSubaddress (Err _) ->
            ( { model | status = Errored }, Cmd.none )

        GotBalances (Ok response) ->
            ( { model | balances = response.balances, status = Loaded }, Cmd.none )

        GotBalances (Err _) ->
            ( { model | status = Errored }, Cmd.none )



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
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]



-- NAV: View helpers:


errorView : Html Msg
errorView =
    Html.div [ Attr.class "accounts-container" ]
        [ Html.h1 [ Attr.class "accounts-title" ] [ Html.text "Donate" ]
        , Html.div [ Attr.class "error-message", Attr.id "accounts-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]



-- filepath: /home/alanpoe/Documents/Development/Monero/elm-merge/haveno-web/src/Pages/Donate.elm


manageDonateView : Html Msg
manageDonateView =
    Html.div [ Attr.class "accounts-container" ]
        [ Html.h1 [ Attr.class "accounts-title" ] [ Html.text "Donate" ]
        , Html.div [ Attr.class "donation-text" ]
            [ Html.p [ Attr.class "donation-description" ]
                [ Html.text "Haveno is free, open-source, and built for your privacy — with no middlemen, no ads, no compromises." ]
            , Html.p [ Attr.class "donation-call-to-action" ]
                [ Html.text "🚀 If this project helps you trade freely, securely, and anonymously, help keep it alive." ]
            , Html.ul [ Attr.class "donation-benefits" ]
                [ Html.li [] [ Html.text "✅ Even 0.01 XMR makes a difference." ]
                , Html.li [] [ Html.text "✅ 100% used for open-source development." ]
                , Html.li [] [ Html.text "✅ No tracking. No strings attached." ]
                ]
            , Html.p [ Attr.class "donation-address-label" ]
                [ Html.text "🔐 Donate XMR to:" ]
            , Html.div [ Attr.class "address-container" ]
                [ Html.div [ Attr.class "address-text" ]
                    [ Html.p [ Attr.id "donationaddress", Attr.class "address-value" ]
                        [ Html.text "86F2Vbx6QRL3jfxeACFUsPTAh2x264dDNdgmt8m96zSQd8rwGrsw4th7XrmdhQkFXf32timtpWupQMWokagkXYfiPKYGvpt" ]
                    ]
                ]
            , Html.button
                [ Attr.class "copy-address-button", Attr.id "copy-address" ]
                [ Html.text "📋 Copy Address" ]
            , Html.p [ Attr.class "donation-thank-you" ]
                [ Html.text "❤️ Thank you for defending freedom and financial privacy." ]
            ]
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


gotPrimaryAddress : Cmd Msg
gotPrimaryAddress =
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
