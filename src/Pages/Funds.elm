module Pages.Funds exposing (Model, Msg(..), Status(..), View(..), btcBalanceAsString, custodialFundsView, errorView, formatBalance, gotNewSubAddress, init, initialModel, primaryAddressView, reservedOfferBalanceAsString, subAddressView, update, view, xmrAvailableBalanceAsString, xmrBalView)

import Extras.Constants as Constants exposing (xmrConversionConstant)
import Grpc
import Html exposing (Html, div, section)
import Html.Attributes as Attr exposing (class)
import Proto.Io.Haveno.Protobuffer as Protobuf
import Proto.Io.Haveno.Protobuffer.Wallets as Wallets
import Protobuf.Types.Int64 exposing (toInts)
import UInt64
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
    , pagetitle = "Funds"
    , balances = Just Protobuf.defaultBalancesInfo
    , isAddressVisible = False
    , primaryaddress = ""
    , errors = []
    , subaddress = ""
    , currentView = FundsView
    }


type Status
    = Loaded
    | Errored


type View
    = FundsView
    | SubAddressView



-- NAV: Init


init : String -> ( Model, Cmd Msg )
init _ =
    ( initialModel
    , Cmd.none
    )



-- NAV: Msg


type Msg
    = GotXmrNewSubaddress (Result Grpc.Error Protobuf.GetXmrNewSubaddressReply)
    | ClickedGotNewSubaddress
    | ToggleVisibility



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleVisibility ->
            ( { model | isAddressVisible = not model.isAddressVisible }, Cmd.none )

        ClickedGotNewSubaddress ->
            ( model, gotNewSubAddress )

        GotXmrNewSubaddress (Ok subAddresponse) ->
            ( { model | subaddress = subAddresponse.subaddress, status = Loaded, currentView = SubAddressView }, Cmd.none )

        GotXmrNewSubaddress (Err _) ->
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
                            FundsView ->
                                custodialFundsView model

                            SubAddressView ->
                                subAddressView model.subaddress
                        ]
            , div
                [ class "split-col"
                ]
                []
            ]
        ]



-- NAV: View helpers:


custodialFundsView : Model -> Html Msg
custodialFundsView model =
    Html.div [ Attr.class "funds-container", Attr.id "custodialFundsView" ]
        [ Html.h1 [ Attr.class "funds-title" ] [ Html.text "Funds" ]
        , primaryAddressView model
        , xmrBalView model
        , Html.div [ Attr.id "btcbalance", Attr.class "balance-text" ]
            [ Html.text ("Available BTC Balance: " ++ btcBalanceAsString model.balances ++ " BTC") ]
        , Html.div [ Attr.id "reservedOfferBalance", Attr.class "balance-text" ]
            [ Html.text ("Reserved Offer Balance: " ++ reservedOfferBalanceAsString model.balances ++ " XMR") ]
        , MyUtils.infoBtn "New Sub Address" "" <| ClickedGotNewSubaddress
        ]


primaryAddressView : Model -> Html Msg
primaryAddressView model =
    Html.div [ Attr.id "primaryaddress", Attr.class "address-container" ]
        [ MyUtils.infoBtn
            (if model.isAddressVisible then
                "Hide"

             else
                "Show"
            )
            ""
            ToggleVisibility
        , Html.div [ Attr.class "address-text" ]
            [ Html.span [ Attr.class "address-label" ] [ Html.text "Primary address: " ]
            , Html.span [ Attr.class "address-value" ]
                [ Html.text
                    (if model.isAddressVisible then
                        model.primaryaddress

                     else
                        Constants.blankAddress
                    )
                ]
            ]
        ]


xmrBalView : Model -> Html Msg
xmrBalView model =
    Html.div [ Attr.id "xmrAvailableBalance", Attr.class "balance-text" ]
        [ Html.text ("Available Balance: " ++ xmrAvailableBalanceAsString model.balances ++ " XMR") ]


errorView : Html Msg
errorView =
    Html.div [ Attr.class "funds-container" ]
        [ Html.h1 [ Attr.class "funds-title" ] [ Html.text "Funds" ]
        , Html.div [ Attr.class "error-message", Attr.id "funds-error-message" ]
            [ Html.text "Error: Unable to retrieve relevant data. Please try again later." ]
        ]


subAddressView : String -> Html Msg
subAddressView newSubaddress =
    Html.div [ Attr.class "funds-container" ]
        [ Html.h1 [ Attr.class "funds-title" ] [ Html.text "Funds" ]
        , Html.div [ Attr.class "address-text", Attr.id "newSubaddress" ]
            [ Html.text ("New Subaddress: " ++ newSubaddress) ]
        ]


xmrAvailableBalanceAsString : Maybe Protobuf.BalancesInfo -> String
xmrAvailableBalanceAsString balInfo =
    case balInfo of
        Just blInfo ->
            case blInfo.xmr of
                Nothing ->
                    "0.00"

                Just xmrbalViewinfo ->
                    let
                        ( firstInt, secondInt ) =
                            toInts xmrbalViewinfo.availableBalance
                    in
                    --String.fromInt firstInt ++ "." ++ String.fromInt secondInt
                    formatBalance { higher = firstInt, lower = secondInt }

        Nothing ->
            "0.00"


btcBalanceAsString : Maybe Protobuf.BalancesInfo -> String
btcBalanceAsString balInfo =
    case balInfo of
        Just blInfo ->
            case blInfo.btc of
                Nothing ->
                    "0.00"

                Just btcbalinfo ->
                    let
                        ( firstInt, secondInt ) =
                            toInts btcbalinfo.availableBalance
                    in
                    formatBalance { higher = firstInt, lower = secondInt }

        Nothing ->
            ""


reservedOfferBalanceAsString : Maybe Protobuf.BalancesInfo -> String
reservedOfferBalanceAsString balInfo =
    case balInfo of
        Just blInfo ->
            case blInfo.xmr of
                Nothing ->
                    "0.00"

                Just xmrbalViewinfo ->
                    let
                        ( firstInt, secondInt ) =
                            toInts xmrbalViewinfo.reservedOfferBalance
                    in
                    String.fromInt firstInt ++ "." ++ String.fromInt secondInt

        Nothing ->
            ""



-- NAV: gRPC calls


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


formatBalance : { higher : Int, lower : Int } -> String
formatBalance int64 =
    let
        -- Convert higher and lower into a full 64-bit integer
        fullUInt64 : UInt64.UInt64
        fullUInt64 =
            let
                highPart =
                    UInt64.fromInt int64.higher |> UInt64.mul (UInt64.fromInt xmrConversionConstant)

                lowPart =
                    if int64.lower < 0 then
                        UInt64.fromInt (int64.lower + xmrConversionConstant)

                    else
                        UInt64.fromInt int64.lower
            in
            UInt64.add highPart lowPart

        -- Convert UInt64 to Float
        fullFloat : Float
        fullFloat =
            UInt64.toFloat fullUInt64

        -- Convert piconero to XMR
        xmrAmount : Float
        xmrAmount =
            fullFloat / 1000000000000

        -- Ensure proper rounding to 11 decimal places
        scale : Float
        scale =
            toFloat (10 ^ 11)

        roundedXmr : Float
        roundedXmr =
            toFloat (round (xmrAmount * scale)) / scale
    in
    String.fromFloat roundedXmr
