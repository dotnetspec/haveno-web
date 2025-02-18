port module Main exposing (..)

-- NOTE: A working Main module that handles URLs and maintains a conceptual Page - i.e. makes an SPA possible
-- Main loads Blank initially.
-- and uses a top level Model where data that needs to be persisted ACROSS pages is held
-- NOTE: exposing Url exposes a different type of Url to
-- just import Url

import Browser
import Browser.Navigation as Nav exposing (..)
import Data.AddressValidity as R
import Data.User as U exposing (User(..))
import Debug exposing (log)
import Erl exposing (..)
import Extras.Constants as Constants exposing (yck_id)
import Extras.TestData as TestData exposing (placeholderUrl)
import Grpc exposing (..)
import Html exposing (Html, a, br, button, div, footer, h2, h3, h4, h5, h6, header, i, img, input, label, li, nav, node, p, source, span, text, ul)
import Html.Attributes as Attr exposing (..)
import Html.Events exposing (onClick)
import Json.Decode as JD
import Json.Encode as JE
import Pages.Blank
import Pages.Buy
import Pages.Dashboard
import Pages.Funds
import Pages.Market
import Pages.Portfolio
import Pages.Sell
import Pages.Support
import Parser exposing (Parser, andThen, chompWhile, end, getChompedString, map, run, succeed)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (..)
import Proto.Io.Haveno.Protobuffer.GetVersion exposing (getVersion)
import Protobuf.Decode
import Task
import Time
import Types.DateType exposing (DateTime(..))
import Url exposing (Protocol(..), Url)
import Url.Parser exposing ((</>), (<?>), oneOf, s)
import Url.Parser.Query as Query exposing (..)


placeholderUrl =
    Url.Url Http "localhost" (Just 1234) "/" Nothing Nothing



{- -- NOTE: String here is coming from the flag in index.html. Change String to
   whatever type the flag is if necessary
-}
{- -- NOTE: All the functions in Browser.application must be assigned functions that match
   their annotations (hover 'application' to see)

   'Model' is the one on this page. Can't mix with 'Model' on other pages
-}
-- NOTE: Url.Url here comes from flags


main : Program String Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        }



-- NAV: Init
-- NOTE: This is used to initialize the model in init and spec tests
-- WARN: The app sees Url.Url as 'elm-spec' when testing


init : String -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flag _ key =
    let
        decodedJsonFromSetupElmmjs =
            case JD.decodeString urlDecoder flag of
                Ok urLAfterFlagDecode ->
                    urLAfterFlagDecode

                Err _ ->
                    Url.Url Https "haveno-web.squashpassion.com" Nothing "" Nothing Nothing

        urlWithDashboardPath =
            { decodedJsonFromSetupElmmjs | path = "/dashboard" }

        -- NOTE: Initialize the whole model here so that can assign Nav.Key
        updatedModel =
            { page = DashboardPage Pages.Dashboard.initialModel
            , flag = urlWithDashboardPath --decodedJsonFromSetupElmmjs
            , key = key
            , time = Time.millisToPosix 0
            , zone = Nothing -- Replace with the actual time zone if available
            , errors = []

            -- REVIEW: Should it be impossible to nav without hw device connection?
            -- HACK: Making these next 2 True, so we can get to the wallet page, fails 10 tests:
            , isXMRWalletConnected = False
            , isApiConnected = False
            , version = "No Haveno version available"
            , currentJsMessage = ""
            , initialized = False
            , isMenuOpen = False
            }
    in
    updateUrl urlWithDashboardPath updatedModel



-- NAV: Model
-- NOTE: define a Page type to represent the different states
-- we care about, and add it to Model .
-- NOTE: Changes like displaying some links as active depending on the current page—
-- requires a change to Model, not just view


type alias Model =
    { page : Page
    , key : Nav.Key
    , flag : Url
    , time : Time.Posix
    , zone : Maybe Time.Zone
    , errors : List String
    , isXMRWalletConnected : Bool
    , isApiConnected : Bool
    , version : String
    , currentJsMessage : String
    , initialized : Bool
    , isMenuOpen : Bool
    }


navigate : Nav.Key -> Cmd Msg
navigate thekey =
    Nav.pushUrl thekey (Url.toString placeholderUrl)



-- forNavigation needs this to be:
--  #{ onUrlChange : Url -> msg, onUrlRequest : Browser.UrlRequest -> msg }#
-- NAV: Msg
-- REVIEW: Move these notes to a separate file somewhere?
-- We 'talk' (e.g. send time to schedule) to the other pages via the Msgs defined here and in those pages.
{- -- NOTE: each variant of a custom type can be considered a type constructor. They are not functions in the
   traditional sense, but they behave similarly in that they take arguments and produce a value of the custom type.
   All the below are creating a value of type Msg. The value is a constructor for the Msg type.
   e.g. ClickedLink Browser.UrlRequest is a constructor for the Msg type. It takes a Browser.UrlRequest value as input

   In practical terms, you would use a type constructor when you want to create a new value of a SPECIFIC type,
   and you would use a function when you want to perform some computation or operation.

   All the below are constructor functions for the Msg type. They are not functions in the traditional sense,
   e.g.
   port receiveMessageFromJs : (String -> msg) -> Sub msg
   ReceivedFromJs String

   subscriptions : Model -> Sub Msg
    subscriptions _ =
    -- NOTE: ReceivedFromJs has no String here cos receiveMessageFromJs wants a function that takes a String
    -- and returns a Msg. This is what ReceivedFromJs was 'constructed' to be
    receiveMessageFromJs ReceivedFromJs



    update : Msg -> Model -> (Model, Cmd Msg)
    update msg model =
    case msg of
        ReceivedFromJs message ->
            -- Handle the message from JavaScript
            (model, Cmd.none)
-}


type Msg
    = ClickedLink Browser.UrlRequest
      -- NOTE: the type of GotDashboardMsg is (Pages.Dashboard.Msg -> Msg)
    | GotDashboardMsg Pages.Dashboard.Msg
    | GotSellMsg Pages.Sell.Msg
    | GotBlankMsg Pages.Blank.Msg
    | GotPortfolioMsg Pages.Portfolio.Msg
    | GotFundsMsg Pages.Funds.Msg
    | GotSupportMsg Pages.Support.Msg
    | GotBuyMsg Pages.Buy.Msg
    | GotMarketMsg Pages.Market.Msg
    | ChangedUrl Url.Url
    | Tick Time.Posix
    | AdjustTimeZone Time.Zone
    | Recv JD.Value
    | NoOp
    | GotVersion (Result Grpc.Error GetVersionReply)
    | InitComplete
    | ToggleMenu



-- ...
-- NAV: Update
-- NOTE: See GotHardwareMsg for example of how data that depended on Main (due to use of subscription)
-- was handled before sending the page model where it could be used
-- NOTE: Roughly ordered in terms of importance


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ClickedLink urlRequest ->
            case urlRequest of
                Browser.External href ->
                    ( model, Nav.load href )

                -- NOTE: simpleMenu has internal hrefs, so updates here
                Browser.Internal url ->
                    let
                        modelWithMenuClosed =
                            { model | isMenuOpen = False }
                    in
                    -- NOTE: If site isn't explicitly branched like
                    -- this, it is parsed as an internal link. We
                    -- need to load it as if it were an external link
                    -- (using Nav.load) for it to work on production server
                    -- this isn't currently used and points nowhere
                    case Url.toString url of
                        "https://haveno-web-dev.netlify.app//" ->
                            ( modelWithMenuClosed, Nav.load (Url.toString url) )

                        -- NOTE: Nav.pushUrl only manipulates the address bar
                        -- and triggers ChangedUrl
                        _ ->
                            updateUrl url modelWithMenuClosed

        -- NOTE: translate URL (e.g. Back btn) into a Page and store it in our Model
        -- this is the place to handle transitions. This is where we can get more fancy
        -- with clicked links (use Erl package on the links e.g. Erl.extractPath)
        {- It looks like we're supposed to use this instead of Browser.onUrlChange in Subscriptions (as per older docs) -}
        -- NOTE: The only way this is triggered currently is by the js menu code clicks
        ChangedUrl url ->
            updateUrl url model

        ToggleMenu ->
            ( { model | isMenuOpen = not model.isMenuOpen }, Cmd.none )

        InitComplete ->
            ( { model | initialized = True }, Cmd.none )

        -- NOTE: GotVersion also used as an API Connection indicator
        GotVersion (Ok versionResp) ->
            let
                verResp =
                    case versionResp of
                        { version } ->
                            version

                newDashBoardModel =
                    case model.page of
                        DashboardPage dashboard ->
                            { dashboard | version = verResp }

                        _ ->
                            Pages.Dashboard.initialModel
            in
            ( { model | isApiConnected = True, version = verResp, page = DashboardPage newDashBoardModel }, Cmd.none )

        GotVersion (Err _) ->
            ( { model | version = "Error obtaining version", isApiConnected = False }, Cmd.none )

        -- NAV: Recv rawJsonMessage
        -- NOTE: This is updated when a message from js is received
        Recv rawJsonMessage ->
            ( model, Cmd.none )

        Tick newTime ->
            ( { model
                | time = newTime
              }
            , Task.perform AdjustTimeZone Time.here
            )

        AdjustTimeZone newZone ->
            ( { model | zone = Just newZone }
            , Cmd.none
            )

        GotDashboardMsg dashboardMsg ->
            case model.page of
                DashboardPage dashboard ->
                    let
                        updatedDashboardModel =
                            { dashboard | version = model.version }
                    in
                    toDashboard model (Pages.Dashboard.update dashboardMsg updatedDashboardModel)

                _ ->
                    ( model, Cmd.none )

        GotSellMsg sellMsg ->
            case model.page of
                SellPage sell ->
                    toSell model (Pages.Sell.update sellMsg sell)

                _ ->
                    ( model, Cmd.none )

        GotBlankMsg blankMsg ->
            case model.page of
                BlankPage blank ->
                    toBlank model (Pages.Blank.update blankMsg blank)

                _ ->
                    ( model, Cmd.none )

        GotPortfolioMsg termsMsg ->
            case model.page of
                PortfolioPage terms ->
                    toPortfolio model (Pages.Portfolio.update termsMsg terms)

                _ ->
                    ( model, Cmd.none )

        GotFundsMsg fundsMsg ->
            case model.page of
                FundsPage fundsModel ->
                    case fundsMsg of
                        Pages.Funds.ClickedGotNewSubaddress ->
                            let
                                newFundsModel =
                                    { fundsModel | currentView = Pages.Funds.SubAddressView, status = Pages.Funds.Loaded }
                            in
                            toFunds model (Pages.Funds.update fundsMsg newFundsModel)

                        _ ->
                            toFunds model (Pages.Funds.update fundsMsg fundsModel)

                _ ->
                    ( model, Cmd.none )

        GotSupportMsg supportMsg ->
            case model.page of
                SupportPage support ->
                    toSupport model (Pages.Support.update supportMsg support)

                _ ->
                    ( model, Cmd.none )

        GotBuyMsg pricingMsg ->
            case model.page of
                BuyPage pricing ->
                    toPricing model (Pages.Buy.update pricingMsg pricing)

                _ ->
                    ( model, Cmd.none )

        GotMarketMsg aboutMsg ->
            case model.page of
                MarketPage about ->
                    toMarket model (Pages.Market.update aboutMsg about)

                _ ->
                    ( model, Cmd.none )

        -- NOTE: GotWalletMsg is triggered by toHardware, which is triggered by updateUrl
        -- which is triggered by init. updateUrl is sent the url and uses the parser to parse it.
        -- The parser outputs the Wallet page so that the case in updateUrl can branch on Wallet.
        -- Wallet.init can then be run to init the page and the page can, through toHardware, be added
        -- to the model in Main (as the current page).
        -- NOTE: Make changes to the Wallet model, cmds etc. in toHardware (more options)
        NoOp ->
            ( model, Cmd.none )



-- NAV: View


view : Model -> Browser.Document Msg
view model =
    let
        contentByPage =
            {- -- NOTE:  We are 'delegating' views to Dashboard.view and Sell.view etc.
               Something similar can be done with subscriptions if required
            -}
            case model.page of
                DashboardPage dashboard ->
                    Pages.Dashboard.view dashboard
                        -- NOTE: Go from Html Pages.Dashboard.Msg value to Html Msg value using Html.map.
                        {- Conceptually, what Html.map is doing for us here is wrapping a Pages.Dashboard.Msg or
                           Pages.Sell.Msg in a Main.Msg , because Main.update knows how to deal with only
                           Main.Msg values. Those wrapped messages will prove useful later when we handle
                           these new messages inside update .

                           We're actually using Pages.Dashboard.view
                           -- NOTE: Html.map is essential to wrap the Dashboard.elm view and convert Dashboard.Msg into Main.Msg
                        -}
                        |> Html.map GotDashboardMsg

                BlankPage dashboard ->
                    Pages.Blank.view dashboard
                        |> Html.map GotBlankMsg

                SellPage dashboard ->
                    Pages.Sell.view dashboard
                        |> Html.map GotSellMsg

                PortfolioPage terms ->
                    Pages.Portfolio.view terms
                        |> Html.map GotPortfolioMsg

                FundsPage privacy ->
                    Pages.Funds.view privacy
                        |> Html.map GotFundsMsg

                SupportPage support ->
                    Pages.Support.view support
                        |> Html.map GotSupportMsg

                BuyPage buy ->
                    Pages.Buy.view buy
                        |> Html.map GotBuyMsg

                MarketPage market ->
                    Pages.Market.view market
                        |> Html.map GotMarketMsg
    in
    -- NAV : View Page Content
    -- TODO: Make this content's naming conventions closely match the
    -- related css.
    -- NOTE: 'pagetitle' or 'title' in pages is not the same as 'title' in the document
    { title = "Haveno-Web"
    , body =
        [ div [ Attr.class "main-nav-flex-container" ] [ menu model ]
        , div [ Attr.class "indicator-container" ] [ indicatorContainer model ]
        , div [ Attr.class "topLogoContainer" ] [ topLogo ]
        , div [ Attr.class "contentByPage" ] [ contentByPage ]
        , div [ Attr.class "footerContent" ] [ footerContent model ]
        ]
    }


indicatorContainer : Model -> Html msg
indicatorContainer model =
    div []
        [ apiConnectionStatusIndicator model
        ]



-- TYPES
-- NOTE: Dashboard.elm is the equivalent of PhotoFolders.elm or 'Folders' in the code
{- -- NOTE: Two data structures for use cases that were similar but ended up NOT being the same. If you're
   getting complicated knock-on effects consider that you may need to split data structures like this.
   Here prompted by 'What’s the problem here? Why isn’t Page working well
   everywhere it used to, now that we’ve expanded it to hold onto more information?'
   Page was an 'overloaded' data structure
-}
{- -- NOTE: Representing a parsed route. Similar, but NOT the same as Page -}
-- NAV: Route
-- TODO: Complete the others as '...Route'


type Route
    = DashboardRoute
    | SellRoute
    | PortfolioRoute
    | FundsRoute
    | Support
    | Buy
    | Market
    | BlankRoute



-- NOTE: Storing different models. Similar, but NOT the same as Route


type
    Page
    -- NOTE: Be able to access the model in the selected page so that it can
    -- be passed to the view for that page:
    = DashboardPage Pages.Dashboard.Model
    | SellPage Pages.Sell.Model
    | PortfolioPage Pages.Portfolio.Model
    | FundsPage Pages.Funds.Model
    | SupportPage Pages.Support.Model
    | BuyPage Pages.Buy.Model
    | MarketPage Pages.Market.Model
    | BlankPage Pages.Blank.Model



--| SetAuthorizationCode (Maybe String)


type alias QueryStringParser a =
    Query.Parser a



-- NAV: Json decoders
-- Decode the URL from JSON-encoded string


justmsgFieldFromJsonDecoder : JD.Decoder OperationEventMsg
justmsgFieldFromJsonDecoder =
    JD.map OperationEventMsg
        (JD.field "operationEventMsg" JD.string)


urlDecoder : JD.Decoder Url
urlDecoder =
    JD.string
        |> JD.andThen
            (\s ->
                case Url.fromString s of
                    Just url ->
                        JD.succeed url

                    Nothing ->
                        JD.fail "Invalid URL"
            )



-- NOTE: Now that we support the Page type, we’re all set up to parse some URLs into it:
-- NOTE: Parsers are functions that take an input string and
-- try to extract a specific piece of information from it,
-- or to verify that it has a certain structure.
-- Similarly to the way a JSON Decoder value describes how to translate a JSON string
-- into a different type, this Parser value describes how to translate a URL into a Page.
-- So we're asking the parser if it recognizes the string in the URL.
-- NOTE: Where we have Page type now, we could have used 'Route' type name instead
-- NOTE: Parser helps us to transform from one type (URL) to another (an Elm Page)
-- NOTE: This parser transforms Strings into Pages
-- NAV: Parser
-- NOTE: This parser is only used by updateUrl


urlAsPageParser : Url.Parser.Parser (Route -> a) a
urlAsPageParser =
    -- NOTE: The </> operator expects a Parser value on each side, and the
    -- Parser.s function turns a hardcoded string into a parser for that string
    -- NOTE: Without this call to Parser.map , our Parser
    -- would output a plain old String whenever it succeeds. Thanks to Parser.map , that
    -- String will instead be passed along to eg. Sell , so the resulting parser will
    -- output a Sell Page we can store in our model.
    -- (Route -> a) is the type of the function that the parser produces.
    -- It is a function that takes a Route value as input and produces a value of type a.
    -- If a Route value representing a Page is sent as input to the parser function,
    -- the resulting 'a' will be a Page (or whatever type Page represents in your specific code).
    oneOf
        [ Url.Parser.map BlankRoute (s "index.html")
        , Url.Parser.map BlankRoute Url.Parser.top
        , Url.Parser.map DashboardRoute (Url.Parser.s "dashboard")
        , Url.Parser.map SellRoute (Url.Parser.s "sell")
        , Url.Parser.map PortfolioRoute (Url.Parser.s "portfolio")
        , Url.Parser.map FundsRoute (Url.Parser.s "funds")
        , Url.Parser.map Support (Url.Parser.s "support")
        , Url.Parser.map Buy (Url.Parser.s "buy")
        , Url.Parser.map Market (Url.Parser.s "market")
        ]


type alias QueryParams =
    { code : Maybe String

    --, location : Maybe String
    --, accountsServer : Maybe String
    }


codeParser : Query.Parser (Maybe String)
codeParser =
    Query.string "code"



-- Define a parser for the query parameters in the URL
{- -- NOTE: The docs specify the 'string' function. Make sure to realize the 'string' function
   is in Parser.Query.string. So Parser.string won't work
-}
-- queryParser : QueryStringParser (Maybe String)
-- queryParser =
--     Query.string "code"
{- -- NOTE: Getting Model.Dashboard and Model.Sell values exactly where we need them.
   Replaces (eventually) urlToPage used in most of the book: "KEEPING
   BOTH MODEL AND CMD FOR INIT
   Without having their init commands run, our pages’ initial HTTP requests aren’t
   being sent to the server to load the pages’ initial data."
   Actually, we don't e.g. do Http.get currently, but this is the right pattern for future ref.
-}
-- NOTE: Data you want to pass fom Main to another module's model can be done in the to<functions>
-- updateUrl is a helper function to init
-- NAV: UpdateUrl - update sub-modules from Main AND update Main from the sub-modules
-- NOTE: Triggered by ChangedUrl


updateUrl : Url.Url -> Model -> ( Model, Cmd Msg )
updateUrl url model =
    -- NOTE: The urlAsPageParser here describes how to translate a URL into a Page.
    -- Parser.parse is a function that uses the description to do it.
    let
        urlMinusQueryStr =
            { url | query = Just "" }
    in
    -- NOTE: Parse the url to get a ROUTE type
    case Url.Parser.parse urlAsPageParser urlMinusQueryStr of
        Just BlankRoute ->
            Pages.Blank.init ()
                |> toBlank model

        Just DashboardRoute ->
            Pages.Dashboard.init { time = Nothing, havenoVersion = model.version }
                |> toDashboard model

        Just SellRoute ->
            Pages.Sell.init ()
                |> toSell model

        Just PortfolioRoute ->
            Pages.Portfolio.init ()
                |> toPortfolio model

        Just FundsRoute ->
            Pages.Funds.init ""
                |> toFunds model

        Just Support ->
            Pages.Support.init ()
                |> toSupport model

        Just Buy ->
            Pages.Buy.init ()
                |> toPricing model

        Just Market ->
            Pages.Market.init ()
                |> toMarket model

        Nothing ->
            Pages.Dashboard.init { time = Nothing, havenoVersion = model.version }
                |> toDashboard model



-- NOTE: This is where we can update Pages's model
{- Let's break down the `toPages` function step by step in simple terms:

   1. **Function Name and Purpose**:
      - Its job is to translate information from the `Pages` module into a format that the main application (`Main`) can understand.

   2. **Input Parameters**:
      - It takes two inputs:
        - `model`: Information about the current state of the application in Main's model.
        - `(Pages, cmd)`: Information from the `Pages` module, including Pages data and commands.

   3. **What it Does**:
      - It takes the existing Main `model` and updates it to include the `Pages` data, indicating that the current page is the "Pages" page.
      - It translates the commands (`cmd`) coming from the `Pages` module to a format that `Main` understands.

   4. **Output**:
      - It produces two things:
        - An updated Main `model` that now includes the `Pages` data and indicates the current page is the "Pages" page.
        - Commands that have been translated to a format that `Main` can use.

   In simpler terms, this function helps the main part of the app (`Main`) understand and work with the Pages information provided by the `Pages` module.
   It's like translating a message into a language that both parts of the app can understand and use effectively.
-}


toDashboard : Model -> ( Pages.Dashboard.Model, Cmd Pages.Dashboard.Msg ) -> ( Model, Cmd Msg )
toDashboard model ( dashboard, cmd ) =
    ( { model | page = DashboardPage dashboard }
      -- NOTE: Cmd.map is a way to manipulate the result of a command
      -- WARN: sendMessageToJs "msgFromElm" is redundant here but if it isn't actually used somewhere the port won't be recognized on document load
    , Cmd.batch [ Cmd.map GotDashboardMsg cmd, sendVersionRequest Protobuf.defaultGetVersionRequest, Task.perform AdjustTimeZone Time.here, sendMessageToJs "msgFromElm" ]
    )


toSell : Model -> ( Pages.Sell.Model, Cmd Pages.Sell.Msg ) -> ( Model, Cmd Msg )
toSell model ( sell, cmd ) =
    ( { model | page = SellPage sell }
      {- -- NOTE: In your example, Cmd.map GotSellMsg cmd, GotSellMsg is indeed a function,
         but you're not explicitly applying it. Cmd.map will take care of applying GotSellMsg to each value that the command produces.
      -}
    , Cmd.map GotSellMsg cmd
    )


toBlank : Model -> ( Pages.Blank.Model, Cmd Pages.Blank.Msg ) -> ( Model, Cmd Msg )
toBlank model ( blankmodel, blankcmd ) =
    ( model
    , Cmd.none
    )


toPortfolio : Model -> ( Pages.Portfolio.Model, Cmd Pages.Portfolio.Msg ) -> ( Model, Cmd Msg )
toPortfolio model ( portfolio, cmd ) =
    ( { model | page = PortfolioPage portfolio }
    , Cmd.map GotPortfolioMsg cmd
    )


toFunds : Model -> ( Pages.Funds.Model, Cmd Pages.Funds.Msg ) -> ( Model, Cmd Msg )
toFunds model ( funds, cmd ) =
    ( { model | page = FundsPage funds }
    , Cmd.map GotFundsMsg cmd
    )


toSupport : Model -> ( Pages.Support.Model, Cmd Pages.Support.Msg ) -> ( Model, Cmd Msg )
toSupport model ( support, cmd ) =
    ( { model | page = SupportPage support }
    , Cmd.map GotSupportMsg cmd
    )


toPricing : Model -> ( Pages.Buy.Model, Cmd Pages.Buy.Msg ) -> ( Model, Cmd Msg )
toPricing model ( pricing, cmd ) =
    ( { model | page = BuyPage pricing }
    , Cmd.map GotBuyMsg cmd
    )


toMarket : Model -> ( Pages.Market.Model, Cmd Pages.Market.Msg ) -> ( Model, Cmd Msg )
toMarket model ( market, cmd ) =
    ( { model | page = MarketPage market }
    , Cmd.map GotMarketMsg cmd
    )



-- NAV : Types
-- NAV: Type aliases


type alias OperationEventMsg =
    { operationEventMsg : String
    }


type alias FromMainToSchedule =
    { time : Maybe DateTime
    , flagUrl : Url.Url
    }



-- NAV: gRPC commands
-- NOTE: This causes 'Error: Uncaught [TypeError: First argument to DataView constructor must be an ArrayBuffer]' in test
-- whilst still passing the test (cos response is stubbed). Issue has been logged here: -- REF: https://github.com/brian-watkins/elm-spec/issues/75


sendVersionRequest : GetVersionRequest -> Cmd Msg
sendVersionRequest request =
    let
        grpcRequest =
            Grpc.new getVersion request
                |> Grpc.addHeader "password" "apitest"
                -- NOTE: "Content-Type" "application/grpc-web+proto" is already part of the request
                -- NOTE: this is referencing the user1_listener via Envoy - in dev that is haveno-ts/config/envoy.test.yaml
                |> Grpc.setHost "http://localhost:8080"
    in
    Grpc.toCmd GotVersion grpcRequest



-- NAV: Helper functions


setDashboardHavenoVersion : Pages.Dashboard.Model -> Model -> Pages.Dashboard.Model
setDashboardHavenoVersion dashboardModel model =
    { dashboardModel | version = model.version }


isValidXMRAddress : String -> Bool
isValidXMRAddress str =
    case run R.validXMRAddressParser str of
        Ok _ ->
            True

        Err _ ->
            False



-- HACK: Using string ops instead of parser, due to Url etc. parser difficulties.let
-- TODO: Create own url parser to eventually replace this:


fromJsonToString : JE.Value -> String
fromJsonToString value =
    JE.encode 0 value


gotCodeFromUrl : Url.Url -> Maybe String
gotCodeFromUrl url =
    {- -- NOTE: Converting from a Url package to Erl package url due to difficulties working with Url.Query package -}
    Just <| String.join "" (Erl.getQueryValuesForKey "code" <| Erl.parse <| Url.toString url)



-- NAV: Subscriptions:


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ receiveMessageFromJs Recv
        ]



-- NAV: Ports - once defined here they can be used in js with app.ports.
-- <portname>.send/subscribe(<data>)
-- WARN: Use the port somewhere in the code or it won't initialize on document load


port sendMessageToJs : String -> Cmd msg


port receiveMessageFromJs : (JD.Value -> msg) -> Sub msg



{- port initializeLedger : (Int -> msg) -> Sub msg
   port getAccountInfoFromLNS : (Int -> msg) -> Sub msg

   -- Handle the responses from the ports
   port ledgerInitialized : (JD.Value -> msg) -> Sub msg
   port accountInfoReceived : (JD.Value -> msg) -> Sub msg
-}
{- -- NOTE: messageReceiver: You could have just recieved a string here (String -> msg),
   but now we're getting a JSON object from js, created like this in the js:

     msgToElm = {
       operationEventMsg: "Update for challenge done"
     }
     msg has a handle function that extracts it using a decoder

-}
{--HACK: Since only Dashboard page no banner, use below. But with more page etc. can add bool banner property to 
each page model and match against-}
-- REF: Zoho-Responsive


showVideoOrBanner : Page -> Html msg
showVideoOrBanner page =
    img [ Attr.class "banner", src "assets/resources/images/Haveno-banner1918X494.png", alt "Haveno", width 1918, height 494, title "Haveno Banner" ]
        []



{- -- NOTE: This type can be Html msg instead
   of Html Msg because footerContent
   has no event handlers.
-}


topLogo : Html msg
topLogo =
    div
        [ class "topLogoContainer"
        ]
        [ div [ class "topLogo-content" ]
            [ img
                [ Attr.src "assets/resources/images/logo-splash100X33.png"

                -- NOTE: always define the width and height of images. This reduces flickering,
                -- because the browser can reserve space for the image before loading.
                , Attr.width 100
                , Attr.height 33
                , Attr.alt "Haveno Logo"
                , Attr.title "Haveno Logo"
                , id "topLogoId"
                , class "topLogo"
                ]
                []
            ]
        ]


menu : Model -> Html Msg
menu model =
    div []
        [ button
            [ classList [ ( "menu-btn", True ), ( "open", model.isMenuOpen ) ]
            , onClick ToggleMenu
            , Attr.name "menubutton"
            , Attr.attribute "data-testid" "menu-button"
            ]
            [ text
                (if model.isMenuOpen then
                    "✖"

                 else
                    "☰"
                )
            ]
        , div
            [ classList [ ( "menu", True ), ( "open", model.isMenuOpen ) ] ]
            [ navLinks model.page ]
        ]


navLinks : Page -> Html msg
navLinks page =
    let
        -- NOTE: A key function in that it takes a Route and a { url, caption } and returns an Html msg
        -- which when clicked will send a message to the update function (ChangedUrl) with the relevant url
        -- Route and page are also there for isActive.
        navLink : Route -> { url : String, caption : String } -> Html msg
        navLink route { url, caption } =
            li [ classList [ ( "active", isActive { link = route, page = page } ), ( "navLink", True ) ] ]
                [ a [ href url ] [ text caption ] ]

        links =
            ul
                [-- NOTE: img is now managed separately so is can be shrunk etc. withouth affecting the links
                ]
                [ li [ class "logoInNavLinks" ] [ a [ Attr.href "https://haveno-web-dev.netlify.app/", Attr.class "topLogoShrink" ] [ topLogo ] ]
                , navLink BlankRoute { url = "/", caption = "" }
                , navLink DashboardRoute { url = "dashboard", caption = "Dashboard" }
                , navLink FundsRoute { url = "funds", caption = "Funds" }
                , navLink Market { url = "market", caption = "Market" }
                , navLink Support { url = "support", caption = "Support" }
                , navLink SellRoute { url = "sell", caption = "Sell" }
                , navLink Buy { url = "buy", caption = "Buy" }
                , navLink PortfolioRoute { url = "portfolio", caption = "Portfolio" }
                ]
    in
    links



-- NAV: Cmd Msgs
-- these might e.g. be sent to ports etc.
{- notifyJsReady : Cmd Msg
   notifyJsReady =
       sendMessageToJs "ElmReady"


   logOutUser : Cmd Msg
   logOutUser =
       sendMessageToJs "logOut"
-}
-- NAV: Main Persistent


isXMRWalletConnectedIndicator : Model -> Html msg
isXMRWalletConnectedIndicator model =
    span []
        [ div [ Attr.class "indicator", Attr.style "text-align" "center" ]
            [ span []
                [ span
                    [ Attr.class
                        (if model.isXMRWalletConnected then
                            "indicator green"

                         else
                            "indicator red"
                        )
                    , Attr.id "xmrwalletconnection"
                    ]
                    [ text
                        (if model.isXMRWalletConnected then
                            "✔"

                         else
                            "✖"
                        )
                    ]
                ]
            ]
        ]


apiConnectionStatusIndicator : Model -> Html msg
apiConnectionStatusIndicator model =
    span []
        [ div [ Attr.class "indicator", Attr.style "text-align" "center" ]
            [ span []
                [ span
                    [ Attr.class
                        (if model.isApiConnected then
                            "indicator green"

                         else
                            "indicator red"
                        )
                    , Attr.id "apiConnectionStatus"
                    ]
                    [ text
                        (if model.isApiConnected then
                            "✔"

                         else
                            "✖"
                        )
                    ]
                ]
            ]
        ]


footerContent : Model -> Html msg
footerContent model =
    footer []
        [ div [ Attr.class "footer", Attr.style "text-align" "center" ]
            [ br []
                []
            , span []
                [ text ""
                , a [ href "https://github.com/haveno-dex/haveno" ] [ text "Haveno-Web" ]
                , br []
                    []
                , text "Open source code & design"
                , p [] [ text "Version 0.3.36" ]
                , text "Haveno Version"
                , p [ id "havenofooterver" ]
                    [ text
                        model.version
                    ]
                ]
            ]
        ]



-- FIX:


isActive : { link : Route, page : Page } -> Bool
isActive { link, page } =
    case
        ( link
        , page
        )
    of
        ( DashboardRoute, DashboardPage _ ) ->
            True

        ( DashboardRoute, _ ) ->
            False

        ( SellRoute, SellPage _ ) ->
            True

        ( SellRoute, _ ) ->
            False

        ( BlankRoute, BlankPage _ ) ->
            True

        ( BlankRoute, _ ) ->
            False

        ( PortfolioRoute, PortfolioPage _ ) ->
            True

        ( PortfolioRoute, _ ) ->
            False

        ( FundsRoute, FundsPage _ ) ->
            True

        ( FundsRoute, _ ) ->
            False

        ( Support, SupportPage _ ) ->
            True

        ( Support, _ ) ->
            False

        ( Buy, BuyPage _ ) ->
            True

        ( Buy, _ ) ->
            False

        ( Market, MarketPage _ ) ->
            True

        ( Market, _ ) ->
            False


{-| -- NOTE: Render dismissable errors. We use this all over the place!
I think it needs a dismissErrors function to go with it ...
-}



-- NOTE: Did this as an example of currying and partial application:


errorMessages : List String -> List (Html msg)
errorMessages errors =
    List.map (\error -> p [] [ text error ]) errors


okButton : msg -> Html msg
okButton dismissErrors =
    button [ onClick dismissErrors ] [ text "Ok" ]


viewErrors : msg -> List String -> Html msg
viewErrors dismissErrors errors =
    if List.isEmpty errors then
        Html.text ""

    else
        div
            [ class "error-messages"
            ]
        <|
            errorMessages errors
                ++ [ okButton dismissErrors ]
