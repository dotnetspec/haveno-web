port module Main exposing (..)

-- NOTE: A working Main module that handles URLs and maintains a conceptual Page - i.e. makes an SPA possible
-- Main loads Dashboard initially.
-- NOTE: exposing Url exposes a different type of Url to
-- just import Url

import Browser
import Browser.Navigation as Nav exposing (..)
import Data.Hardware as R
import Data.User as U exposing (User(..))
import Debug exposing (log)
import Element exposing (Element, el)
import Erl exposing (..)
import Extras.Constants as Constants exposing (yck_id)
import Extras.TestData as TestData exposing (placeholderUrl)
import Framework.Heading as Heading
import Grpc exposing (..)
import Html exposing (Html, a, br, button, div, footer, h2, h3, h5, h6, header, i, img, li, nav, node, p, source, span, text, ul)
import Html.Attributes as Attr exposing (..)
import Html.Events exposing (onClick)
import Json.Decode as JD
import Json.Encode as JE
import Pages.Buy
import Pages.Dashboard
import Pages.Funds
import Pages.Accounts exposing (hardwareSubscriptions)
import Pages.Hardware exposing (hardwareSubscriptions)
import Pages.Market
import Pages.Portfolio
import Pages.Blank
import Pages.Sell
import Pages.Support
import Parser exposing (Parser, andThen, chompWhile, end, getChompedString, map, run, succeed)
import Proto.Io.Haveno.Protobuffer as Protobuf exposing (..)
import Proto.Io.Haveno.Protobuffer.GetVersion exposing (getVersion)
import Spec.Navigator exposing (show)
import Spec.Step exposing (log)
import Task
import Time
import Types.DateType exposing (DateTime(..))
import Url exposing (Protocol(..), Url)
import Url.Parser exposing ((</>), (<?>), oneOf, s)
import Url.Parser.Query as Query exposing (..)



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
-- NOTE: Nav.Key is a special Elm type to avoid bugs - just pass, and leave, it
{- -- NOTE: we need to populate Pages.Dashboard.Model values in our init function. How can
   we obtain a Pages.Dashboard.Model value? By calling Dashboard.init .

   Change the type (here and in Main) of any flag you pass in if necessary.

   We're using init to store data in our top level Model where data that needs to be
   persisted ACROSS 'pages' is held
-}
{- init : String -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
   init flag url maybeKey =

       case maybeKey of
           Just key ->
               actualInit flag url key

           Nothing ->
               testInit flag url
       updateUrl url { page = NotFound, key = key, flag = decodedJsonFromSetupElmmjs, time = Time.millisToPosix 0, zone = Just Time.utc, errors = [ "" ] }
-}


init : String -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flag url key =
    let
        decodedJsonFromSetupElmmjs =
            case JD.decodeString urlDecoder flag of
                Ok urL ->
                    urL

                Err _ ->
                    -- Handle the case where decoding fails
                    Url.Url Https "haveno-web.squashpassion.com" Nothing "" Nothing Nothing

        localnavigate newUrl =
            Nav.pushUrl key (Url.toString newUrl)

        updatedModel =
            { mainInitModel | flag = decodedJsonFromSetupElmmjs, key = localnavigate }
    in
    updateUrl (updateUrlPath url "/hardware") updatedModel



--updateUrl url updatedModel
-- REVIEW:  FORGET THE KEY AND USE FLAG FOR INDICATING NAVIGATION


updateUrlPath : Url.Url -> String -> Url.Url
updateUrlPath url newPath =
    { url | path = newPath }



-- NAV: Model
-- NOTE: define a Page type to represent the different states
-- we care about, and add it to Model .
-- NOTE: Changes like displaying some links as active depending on the current page—
-- requires a change to Model, not just view


type alias Model =
    { page : Page
    , key : Url -> Cmd Msg
    , flag : Url
    , time : Time.Posix
    , zone : Maybe Time.Zone
    , errors : List String
    , isHardwareLNSConnected : Bool
    , isHardwareLNXConnected : Bool
    , isXMRWalletConnected : Bool
    , xmrWalletAddress : String
    , isPopUpVisible : Bool
    , isNavMenuActive : Bool
    , version : Maybe GetVersionReply
    }


navigate : Nav.Key -> Cmd Msg
navigate thekey =
    Nav.pushUrl thekey (Url.toString placeholderUrl)



-- forNavigation needs this to be:
--  #{ onUrlChange : Url -> msg, onUrlRequest : Browser.UrlRequest -> msg }#
-- NOTE: This is used to initialize the model in init and spec tests
-- NAV: Main's Initial Model


mainInitModel : Model
mainInitModel =
    { page = HardwarePage Pages.Hardware.initialModel

    -- NOTE: The following 2 params are replaced in init:
    , key = \_ -> Cmd.none
    , flag = Url.Url Http "localhost" (Just 1234) "/hardware" Nothing Nothing
    , time = Time.millisToPosix 0
    , zone = Nothing -- Replace with the actual time zone if available
    , errors = []
    , isHardwareLNSConnected = False
    , isHardwareLNXConnected = False
    , isXMRWalletConnected = False
    , xmrWalletAddress = ""
    , isPopUpVisible = True
    , isNavMenuActive = True
    , version = Nothing
    }



-- NAV: Msg
-- REVIEW: Move these notes to a separate file somewhere?
-- We 'talk' (e.g. send time to schedule) to the other pages via the Msgs defined here and in those pages.
{- -- NOTE: each variant of a custom type can be considered a type constructor. They are not functions in the
   traditional sense, but they behave similarly in that they take arguments and produce a value of the custom type.
   All the below are creating a value of type Msg. The value is a constructor for the Msg type.
   e.g. ClickedLink Browser.UrlRequest is a constructor for the Msg type. It takes a Browser.UrlRequest value as input

   In practical terms, you would use a type constructor when you want to create a new value of a specific type,
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
    | GotHardwareMsg Pages.Hardware.Msg
    | ChangedUrl Url.Url
    | Tick Time.Posix
    | AdjustTimeZone Time.Zone
    | Recv JD.Value
    | RecvText String
    | NoOp
    | HardwareDeviceConnect
    | ShowPopUp
    | HidePopUp
    | GotVersion (Result Grpc.Error GetVersionReply)



--| MsgToSpecMsg Msg
-- ...
-- NAV: Update
-- NOTE: See GotHardwareMsg for example of how data that depended on Main (due to use of subscription)
-- was handled before sending the page model where it could be used


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotVersion (Ok versionResp) ->
            ( { model | version = Just versionResp }, Cmd.none )

        GotVersion (Err _) ->
            ( { model | version = model.version }, Cmd.none )

        ShowPopUp ->
            ( { model | isPopUpVisible = True }, Cmd.none )

        HidePopUp ->
            ( { model | isPopUpVisible = False, isNavMenuActive = True }
            , Cmd.none
            )

        HardwareDeviceConnect ->
            
            ( model
            , -- NOTE: Old msg showing formatting - 'sendMessageToJs ("fetchRanking" ++ "~^&" ++ ownedRanking.id ++ "~^&ownedranking")'
              sendMessageToJs
                "connectLNS"
            )

        RecvText textMessageFromJs ->
            ( model, Cmd.none )

        -- NAV: Recv rawJsonMessage
        -- NOTE: This is updated when a message from js is received
        Recv rawJsonMessage ->
            
            -- NOTE: rawJsonMessage is a Json value that is ready to be decoded. It does not need to be
            -- converted to a string.
            if String.contains "Problem" (fromJsonToString rawJsonMessage) then
                ( { model | errors = model.errors ++ [ "Problem fetching data" ] }, Cmd.none )

            else if String.contains "LOGINDENIED" (fromJsonToString rawJsonMessage) then
                ( { model | errors = model.errors ++ [ "Login Denied - Please try again ..." ] }, Cmd.none )

            else
                case model.page of
                    DashboardPage _ ->
                        if (model.isHardwareLNSConnected || model.isHardwareLNXConnected) && model.isXMRWalletConnected then
                            ( model, Cmd.none )

                        else
                            --toHardware model (Pages.Hardware.update (Pages.Hardware.ResponseDataFromMain rawJsonMessage) Pages.Hardware.initialModel)
                            updateUrl (Url.Url Http "localhost" Nothing "/hardware" Nothing Nothing) model

                    SellPage _ ->
                        ( model, Cmd.none )

                    BlankPage _ ->
                        ( model, Cmd.none )

                    PortfolioPage _ ->
                        ( model, Cmd.none )

                    FundsPage _ ->
                        ( model, Cmd.none )

                    SupportPage _ ->
                        ( model, Cmd.none )

                    BuyPage _ ->
                        ( model, Cmd.none )

                    MarketPage _ ->
                        ( model, Cmd.none )

                    HardwarePage hwModel ->
                        let
                            -- NOTE: You can only see the rawJsonMessage in the console if you use JE.encode 2
                            -- but you can't decode it if you use it that way
                            --_ = Debug.log "receivedJson" (E.encode 0 receivedJson)
                            -- NOTE: We are doing the logic here so that Main's model is updated as well as hardware's
                            -- REVIEW: If we can update Main's model after updating hardware's model, we can avoid doing it here
                            decodedHardwareDeviceMsg =
                                case JD.decodeValue justmsgFieldFromJsonDecoder rawJsonMessage of
                                    Ok message ->
                                        message.operationEventMsg

                                    Err err ->
                                        --JsonMsgFromJs "ERROR" (JsonData (E.object [])) <| { userid = D.errorToString err, nickname = D.errorToString err }
                                        "error"

                            updatedIsLNSConnected =
                                if model.isHardwareLNSConnected == False && decodedHardwareDeviceMsg == "nanoS" then
                                    
                                    True

                                else if model.isHardwareLNSConnected == True then
                                    True

                                else
                                    False

                            updatedIsLNXConnected =
                                if model.isHardwareLNXConnected == False && decodedHardwareDeviceMsg == "nanoX" then
                                    
                                    True

                                else if model.isHardwareLNXConnected == True then
                                    True

                                else
                                    False

                            updatedIsValidXMRAddressConnected =
                                if model.isXMRWalletConnected == False && isValidXMRAddress decodedHardwareDeviceMsg then
                                    True

                                else if model.isXMRWalletConnected == True then
                                    True

                                else
                                    False

                            updatedWalletAddress =
                                if isValidXMRAddress decodedHardwareDeviceMsg then
                                    decodedHardwareDeviceMsg

                                else
                                    ""

                            newUrl =
                                Url.Url Http "localhost" (Just 1234) "/hardware" Nothing Nothing

                            -- HACK: You will probably want to change this to a more sophisticated logic
                            popupVisibility =
                                if updatedIsLNSConnected || updatedIsLNXConnected || updatedIsValidXMRAddressConnected then
                                    False

                                else
                                    True

                            newHardwareModel =
                                { hwModel
                                    | isHardwareLNSConnected = updatedIsLNSConnected
                                    , isHardwareLNXConnected = updatedIsLNXConnected
                                    , isXMRWalletConnected = updatedIsValidXMRAddressConnected
                                    , xmrWalletAddress = updatedWalletAddress
                                }

                            newPage =
                                if updatedIsValidXMRAddressConnected then
                                    DashboardPage Pages.Dashboard.initialModel

                                else
                                    HardwarePage newHardwareModel

                            newUrlAfterCheckConnections =
                                if updatedIsValidXMRAddressConnected then
                                    Url.Url Http "localhost" (Just 1234) "/dashboard" Nothing Nothing

                                else
                                    Url.Url Http "localhost" (Just 1234) "/hardware" Nothing Nothing

                            newMainModel =
                                { model
                                    | page = newPage
                                    , isHardwareLNSConnected = updatedIsLNSConnected
                                    , isHardwareLNXConnected = updatedIsLNXConnected
                                    , isXMRWalletConnected = updatedIsValidXMRAddressConnected
                                    , isPopUpVisible = popupVisibility
                                    , flag = newUrlAfterCheckConnections
                                    , xmrWalletAddress = updatedWalletAddress

                                    --, selectedranking = newRanking
                                    --, objectJSONfromJSPort = Just decodedJsObj
                                    --, errors = errors
                                }

                            -- NOTE: model.key newUrlAfterCheckConnections actually changes the path in the browser. Not sure if need to do this
                        in
                        -- NOTE: unless we figure out how to update Main's model after updating hardware's model, we will not
                        -- be using ResponseDataFromMain to manage the logic here.
                        --toHardware newMainModel (Pages.Hardware.update (Pages.Hardware.ResponseDataFromMain rawJsonMessage) newHardwareModel)
                        --updateUrl (Url.Url Http "localhost" Nothing "/hardware" Nothing Nothing) newMainModel
                        updateUrl newUrlAfterCheckConnections newMainModel

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

        ClickedLink urlRequest ->
            case urlRequest of
                Browser.External href ->
                    ( model, Nav.load href )

                Browser.Internal url ->
                    -- NOTE: If site isn't explicitly branched like
                    -- this, it is parsed as an internal link. We
                    -- need to load it as if it were an external link
                    -- (using Nav.load) for it to work on production server
                    -- this isn't currently used and points nowhere
                    case Url.toString url of
                        "https://haveno-web.squashpassion.com/" ->
                            ( model, Nav.load (Url.toString url) )

                        -- NOTE: Nav.pushUrl only manipulates the address bar
                        -- and triggers ChangedUrl
                        _ ->
                            ( model, model.key url )

        -- NOTE: translate URL (e.g. Back btn) into a Page and store it in our Model
        -- this is the place to handle transitions. This is where we can get more fancy
        -- with clicked links (use Erl package on the links e.g. Erl.extractPath)
        {- It looks like we're supposed to use this instead of Browser.onUrlChange in Subscriptions (as per older docs) -}
        ChangedUrl url ->
            updateUrl url model

        GotDashboardMsg dashboardMsg ->
            case model.page of
                DashboardPage dashboard ->
                    toDashboard model (Pages.Dashboard.update dashboardMsg dashboard)

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

        GotFundsMsg privacyMsg ->
            case model.page of
                FundsPage privacy ->
                    toFunds model (Pages.Funds.update privacyMsg privacy)

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

        -- NOTE: GotHardwareMsg is triggered by toHardware, which is triggered by updateUrl
        -- which is triggered by init. updateUrl is sent the url and uses the parser to parse it.
        -- The parser outputs the Hardware page so that the case in updateUrl can branch on Hardware.
        -- Hardware.init can then be run to init the page and the page can, through toHardware, be added
        -- to the model in Main (as the current page).
        -- NOTE: Make changes to the Hardware model, cmds etc. in toHardware (more options)
        GotHardwareMsg hardwareMsg ->
            case model.page of
                HardwarePage hardwareModel ->
                    -- NOTE: Example of handling data coming from sub module to main
                    -- If the message is one that needs to be handled in Main (e.g. sends message to port)
                    -- then handle it here:
                    case hardwareMsg of
                        Pages.Hardware.ClickedHardwareDeviceConnect ->
                            let
                                

                                newHardwareModel =
                                    { hardwareModel | queryType = Pages.Hardware.Spectator }
                            in
                            ( { model
                                | page =
                                    HardwarePage newHardwareModel
                              }
                            , -- NOTE: Old msg showing formatting - 'sendMessageToJs ("fetchRanking" ++ "~^&" ++ ownedRanking.id ++ "~^&ownedranking")'
                              sendMessageToJs
                                "connectLNS"
                            )

                        Pages.Hardware.ClickedXMRWalletConnect ->
                            let
                                newHardwareModel =
                                    { hardwareModel | queryType = Pages.Hardware.LoggedInUser }
                            in
                            ( { model | page = HardwarePage newHardwareModel }
                            , sendMessageToJs
                                "getMoneroAddress"
                            )

                        Pages.Hardware.ClickedXMRInitiateTransaction amt ->
                            let
                                newHardwareModel =
                                    { hardwareModel | queryType = Pages.Hardware.LoggedInUser }
                            in
                            ( { model | page = HardwarePage newHardwareModel }
                            , sendMessageToJs <|
                                "initiateXMRToBTCTrans "
                                    ++ "~^&"
                                    ++ amt
                            )

                        _ ->
                            
                            -- otherwise operate within the Hardware sub module:
                            toHardware model (Pages.Hardware.update hardwareMsg hardwareModel)

                _ ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )



-- NAV: View


{-| Take a page's Html and frames it with a header and footer.

The caller provides the current user, so we can display in either
"signed in" (rendering username) or "signed out" mode.

isLoading is for determining whether we should show a loading spinner
in the header. (This comes up during slow page transitions.)

-}



-- NOTE: Just to illustrate that model can be clarified by explicitly
-- exposing it in annotation


view : Model -> Browser.Document Msg
view model =
    let
        contentByPage =
            {- -- NOTE:  We are 'delegating' views to Dashboard.view and Sell.view etc.
               Something similar can be done with subscriptions if required
            -}
            --if model.isNavMenuActive then
            case model.page of
                DashboardPage dashboard ->
                    Pages.Dashboard.view dashboard
                        -- NOTE: Go from Html Pages.Dashboard.Msg value to Html Msg value using Html.map.
                        {- Conceptually, what Html.map is doing for us here is wrapping a Pages.Dashboard.Msg or
                           Pages.Sell.Msg in a Main.Msg , because Main.update knows how to deal with only
                           Main.Msg values. Those wrapped messages will prove useful later when we handle
                           these new messages inside update .

                           We're actually using Pages.Dashboard.view
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

                HardwarePage hardware ->
                    
                    Pages.Hardware.view hardware
                        |> Html.map GotHardwareMsg

        isConnected =
            if model.isHardwareLNSConnected || model.isHardwareLNXConnected then
                True

            else
                False

        {- else
           div [] []
        -}
    in
    -- NAV : View Page Content
    -- TODO: Make this content's naming conventions closely match the
    -- related css.
    -- NOTE: 'pagetitle' or 'title' in pages is not the same as 'title' in the document
    { title = "Haveno-Web"
    , body =
        [ pageHeader model.page
        , showVideoOrBanner model.page
        , viewPopUp model
        , contentByPage
        , isHWConnectedIndicator isConnected
        , isXMRWalletConnectedIndicator model.isXMRWalletConnected model.xmrWalletAddress
        , footerContent model
        ]
    }



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


type Route
    = Dashboard
    | Sell
    | Portfolio
    | Funds
    | Support
    | Buy
    | Market
    | Hardware
    | Blank



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
    | HardwarePage Pages.Hardware.Model
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
        [ Url.Parser.map Blank (s "index.html")
        , Url.Parser.map Blank Url.Parser.top
        , Url.Parser.map Dashboard (Url.Parser.s "dashboard")
        , Url.Parser.map Sell (Url.Parser.s "sell")
        , Url.Parser.map Portfolio (Url.Parser.s "portfolio")
        , Url.Parser.map Funds (Url.Parser.s "funds")
        , Url.Parser.map Support (Url.Parser.s "support")
        , Url.Parser.map Buy (Url.Parser.s "buy")
        , Url.Parser.map Market (Url.Parser.s "market")
        , Url.Parser.map Hardware (Url.Parser.s "hardware")
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


updateUrl : Url.Url -> Model -> ( Model, Cmd Msg )
updateUrl url model =
    -- NOTE: The urlAsPageParser here describes how to translate a URL into a Page.
    -- Parser.parse is a function that uses the description to do it.
    let
        urlMinusQueryStr =
            { url | query = Just "" }

        oauthCode =
            gotCodeFromUrl url
    in
    case Url.Parser.parse urlAsPageParser urlMinusQueryStr of
        Just Dashboard ->
            let
                newFlagUrl =
                    Url.Url Http "localhost" (Just 1234) "/dashboard" Nothing Nothing

                newModel =
                    { model | flag = newFlagUrl }
            in
            -- TODO: Review below as we don't use Oauth.Callback any more:
            -- NOTE: When we get an oauth code we want to move program control to Oauth.Callback
            -- so that we can manage the UI with the user separately from Main.elm.
            -- Specifying /oauth/callback in Zoho URI config is more tricky than letting it return
            -- to root and then switching here according to whether or not a code has been received
            -- REVIEW: We're no longer using oathcode
            case oauthCode of
                Nothing ->
                    -- NOTE: Unlike in book, we're not sending filenames etc. to init. Just ().
                    -- If you wanted info in this page to e.g. be based on an Http.get then
                    -- follow book to setup here:
                    Pages.Dashboard.init { time = Nothing, flagUrl = newFlagUrl }
                        |> toDashboard newModel

                Just "" ->
                    Pages.Dashboard.init { time = Nothing, flagUrl = newFlagUrl }
                        |> toDashboard newModel

                -- HACK: -- FIX?
                Just _ ->
                    Pages.Dashboard.init { time = Nothing, flagUrl = newFlagUrl }
                        |> toDashboard newModel

        Just Sell ->
            Pages.Sell.init ()
                |> toSell model
        Just Blank ->
            Pages.Blank.init ()
                |> toBlank model

        Just Portfolio ->
            Pages.Portfolio.init ()
                |> toPortfolio model

        Just Funds ->
            Pages.Funds.init ()
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

        Just Hardware ->
            let
                newHWmodel =
                    case model.page of
                        HardwarePage hardwareModel ->
                            -- NOTE: Update Hardware page with relevant parts of Main's model
                            { hardwareModel
                                | isHardwareLNSConnected = model.isHardwareLNSConnected
                                , isHardwareLNXConnected = model.isHardwareLNXConnected
                                , isXMRWalletConnected = model.isXMRWalletConnected
                            }

                        _ ->
                            Pages.Hardware.initialModel

                newModel =
                    { model | page = HardwarePage newHWmodel }
            in
            -- NOTE: This is the only place we can pass args from Main.elm into
            -- the sub module for initialization
            -- REVIEW: Time is sent through here as it may speed up the slots fetch in Hardware - tbc
            -- RF: Change name flagUrl to domainUrl
            Pages.Hardware.init { time = Nothing, flagUrl = Url.Url Http "localhost" (Just 1234) "/hardware" Nothing Nothing }
                -- Model -> ( Pages.Hardware.Model, Cmd Pages.Hardware.Msg ) -> ( Model, Cmd Msg )
                |> toHardware newModel

        Nothing ->
            Pages.Dashboard.init { time = Nothing, flagUrl = model.flag }
                |> toDashboard model


toDashboard : Model -> ( Pages.Dashboard.Model, Cmd Pages.Dashboard.Msg ) -> ( Model, Cmd Msg )
toDashboard model ( dashboard, cmd ) =
    ( { model | page = DashboardPage dashboard }
      -- NOTE: Cmd.map is a way to manipulate the result of a command
    , Cmd.batch [ Cmd.map GotDashboardMsg cmd, Task.perform AdjustTimeZone Time.here ]
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
toBlank model ( blank, cmd ) =
    ( { model | page = BlankPage blank }
      {- -- NOTE: In your example, Cmd.map GotSellMsg cmd, GotSellMsg is indeed a function,
         but you're not explicitly applying it. Cmd.map will take care of applying GotSellMsg to each value that the command produces.
      -}
    , Cmd.map GotBlankMsg cmd
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



{- Let's break down the `toHardware` function step by step in simple terms:

   1. **Function Name and Purpose**:
      - Its job is to translate information from the `Hardware` module into a format that the main application (`Main`) can understand.

   2. **Input Parameters**:
      - It takes two inputs:
        - `model`: Information about the current state of the application in Main's model.
        - `(hardware, cmd)`: Information from the `Hardware` module, including hardware data and commands.

   3. **What it Does**:
      - It takes the existing Main `model` and updates it to include the `hardware` data, indicating that the current page is the "Hardware" page.
      - It translates the commands (`cmd`) coming from the `Hardware` module to a format that `Main` understands.

   4. **Output**:
      - It produces two things:
        - An updated Main `model` that now includes the `hardware` data and indicates the current page is the "Hardware" page.
        - Commands that have been translated to a format that `Main` can use.

   In simpler terms, this function helps the main part of the app (`Main`) understand and work with the hardware information provided by the `Hardware` module.
   It's like translating a message into a language that both parts of the app can understand and use effectively.
-}


toHardware : Model -> ( Pages.Hardware.Model, Cmd Pages.Hardware.Msg ) -> ( Model, Cmd Msg )
toHardware model ( hardware, cmd ) =
    ( {- -- NOTE: Cmd.map is applying the GotHardwareMsg constructor to the message in the command.
         In Elm, GotHardwareMsg is a type constructor for the Msg type. It's used to create a new Msg value. When you use
         GotHardwareMsg with Cmd.map, you're telling Elm to take the message that results from the command and wrap it in GotHardwareMsg.
         In this code, cmd is a command that will produce a Pages.Hardware.Msg when it's executed. Cmd.map GotHardwareMsg cmd creates a new
         command that, when executed, will produce a Msg that wraps the Pages.Hardware.Msg in GotHardwareMsg.

         So, while GotHardwareMsg is not a function in the traditional sense, it's a type constructor that can be used like a
         function to create new values.
      -}
      model
    , --Cmd.map GotHardwareMsg cmd
      Cmd.batch [ Cmd.map GotHardwareMsg cmd, sendVersionRequest {} ]
    )



-- NAV: Type aliases


type alias OperationEventMsg =
    { operationEventMsg : String
    }


type alias FromMainToSchedule =
    { time : Maybe DateTime
    , flagUrl : Url.Url
    }



-- NAV: gRPC commands


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



-- NAV: Helper functions


viewPopUp : Model -> Html Msg
viewPopUp model =
    div []
        [ if model.isPopUpVisible then
            div [ class "modal" ]
                [ div [ class "modal-content" ]
                    [ h2 [] [ text "Haveno Web App" ]
                    , p [] [ text "No Hardware Device Detected!" ]
                    , p [] [ text "Please connect your hardware device to continue" ]
                    , button [ onClick HidePopUp ] [ text "Connect Hardware" ]
                    ]
                ]

          else if model.isHardwareLNSConnected then
            div [] [ text "Nano S Connected" ]

          else if model.isHardwareLNXConnected then
            div [] [ text "Nano X Connected" ]

          else
            div [] []
        ]


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



-- NAV: Ports - once defined here they can be used in js with app.ports.<portname>.send/subscribe(<data>)


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
-- NOTE: messageReceiver handled above in subscriptions via update Recv


port messageReceiver : (JD.Value -> msg) -> Sub msg


port setStorage : JE.Value -> Cmd msg



{--HACK: Since only Dashboard page no banner, use below. But with more page etc. can add bool banner property to 
each page model and match against-}


showVideoOrBanner : Page -> Html msg
showVideoOrBanner page =
    img [ Attr.class "banner", src "resources/Banners/monero - 1918x494.png", alt "Monero", width 1918, height 494, title "Monero Banner" ]
        []



-- NOTE: This keeps the header links on the same row
{- topLinks : Html msg
   topLinks =
          div [ Attr.class "topLinks" ]
              [ topLinksLeft
              , div [ Attr.class "topLinksLogo" ] [ hrefLogoImage ]
              , socialsLinks
              ]
-}
{- -- NOTE: This type can be Html msg instead
   of Html Msg because footerContent
   has no event handlers.
-}


topLinksLogo : Html msg
topLinksLogo =
    div [ Attr.class "topLinksLogo" ] [ a [ Attr.href "https://haveno-web.squashpassion.com" ] [ topLinksLogoImage ] ]


topLinksLogoImage : Html msg
topLinksLogoImage =
    img
        [ Attr.src "resources/Logos/monero_icon.jpg"

        -- NOTE: always define the width and height of images. This reduces flickering,
        -- because the browser can reserve space for the image before loading.
        , Attr.width 100
        , Attr.height 33
        , Attr.alt "Monero Logo"
        , Attr.title "Monero Logo"
        ]
        []


logoImage : Html msg
logoImage =
    img
        [ Attr.src "resources/Logos/monero_icon.jpg"

        -- NOTE: always define the width and height of images. This reduces flickering,
        -- because the browser can reserve space for the image before loading.
        , Attr.width 200
        , Attr.height 67
        , Attr.alt "Monero Logo"
        , Attr.title "Monero Logo"
        ]
        []


socialsLinks : Html msg
socialsLinks =
    div
        [ Attr.class "socials-main-container"
        ]
        [ {- -- NOTE: Only turn these on when they exist.
             The green b/ground is cos whatsapp is at the .md.hydrated:hover (low) level
             See css notes for further info
          -}
          --     div
          --     [ Attr.class "socials-sub-container socials-sub-container-facebook"
          --     ]
          --     [ i
          --         [{- NOTE: all elements are nodes, but not all nodes are elements -}]
          --         [ node "ion-icon"
          --             [ Attr.name "logo-facebook"
          --             ]
          --             []
          --         ]
          --     ]
          -- , div
          --     [ Attr.class "socials-sub-container socials-sub-container-youtube"
          --     ]
          --     [ i
          --         []
          --         [ node "ion-icon"
          --             [ Attr.name "logo-youtube"
          --             ]
          --             []
          --         ]
          --     ]
          -- , div
          --     [ Attr.class "socials-sub-container socials-sub-container-instagram"
          --     ]
          --     [ i
          --         []
          --         [ node "ion-icon"
          --             [ Attr.name "logo-instagram"
          --             ]
          --             []
          --         ]
          --     ]
          -- ,
          div
            [ Attr.class "socials-sub-container socials-sub-container-whatsapp"
            ]
            [ i
                []
                [ a
                    [ Attr.href ""
                    , Attr.target "_blank"
                    ]
                    [ node "ion-icon"
                        [ Attr.name "logo-whatsapp"
                        ]
                        []
                    ]
                ]
            ]
        ]



{- -- NOTE: What gets displayed here is heavily dependent on css -}


pageHeader : Page -> Html msg
pageHeader page =
    let
        pageheader =
            header []
                [ div [ Attr.class "topLinks-flex-container" ]
                    {- -- NOTE: When, how and/or if burgerMenu, topLinksLogo or topLinksLeft is displayed is determined by the .css -}
                    [ burgerMenu page
                    , topLinksLogo
                    , topLinksLeft
                    , socialsLinks
                    ]

                {- -- NOTE: When main-nav-flex-container is displayed is determined by the .css -}
                , div [ Attr.class "main-nav-flex-container" ]
                    [ div [ class "section" ]
                        [{- input [ type_ "checkbox", id "nav-toggle", class "nav-toggle" ] []
                            , nav [ class "navlinks" ] [ navLinks page ]
                            , label [ for "nav-toggle", Attr.classList [ ( "nav-toggle-label", True ), ( "header-left-element", False ) ] ]
                                [ div []
                                    []
                                ]
                         -}
                         --nav [ class "navlinks" ] [ navLinks page ]
                        ]

                    --,
                    , div [ class "nav-section-above800px" ]
                        [ --div [ Attr.class "topLinksLogo" ] [ hrefLogoImage ]
                          nav [ class "above800pxnavlinks" ] [ navLinks page ]
                        ]
                    , div [ class "section" ]
                        [--socialsLinks
                        ]
                    ]
                ]

        --]
    in
    pageheader


burgerMenu : Page -> Html msg
burgerMenu page =
    div [ class "menu-btn", id "menu-btn" ]
        [ div [ class "menu-btn_burger" ]
            []
        , nav [ class "below800pxnavlinks" ] [ navLinks page ]
        ]


navLinks : Page -> Html msg
navLinks page =
    let
        links =
            ul
                [-- NOTE: img is now managed separately so is can be shrunk etc. withouth affecting the links
                ]
                [ li [ class "logo" ] [ a [ Attr.href "https://haveno-web.squashpassion.com", Attr.class "logoImageShrink" ] [ logoImage ] ]
                , navLink Dashboard { url = "/", caption = "Dashboard" }
                , navLink Market { url = "market", caption = "Market" }
                , navLink Support { url = "support", caption = "Support" }
                , navLink Sell { url = "sell", caption = "Sell" }
                , navLink Buy { url = "buy", caption = "Buy" }
                , navLink Hardware { url = "hardware", caption = "Hardware" }
                , navLink Portfolio { url = "portfolio", caption = "Portfolio" }
                ]

        -- NOTE: route and page are only there for isActive.
        -- navLink just writes out some html and helps us manage isActive
        -- it doesn't parse routes etc.
        navLink : Route -> { url : String, caption : String } -> Html msg
        navLink route { url, caption } =
            li [ classList [ ( "active", isActive { link = route, page = page } ), ( "navLink", True ) ] ]
                [ a [ href url ] [ text caption ] ]
    in
    links


topLinksLeft : Html msg
topLinksLeft =
    let
        links =
            div
                [ Attr.class "topLinksLeft"
                ]
                -- FIX: make into mailto:
                [ Html.i
                    [ Attr.class "material-icons"
                    ]
                    [ text "email" ]
                , navLink { url = "/", caption = "potential support url   " }
                , Html.i
                    [ Attr.class "material-icons"
                    ]
                    [ text "support" ]
                , navLink { url = "support", caption = "other potential support" }
                ]

        -- NOTE: We just want to display these on every page, so no route required
        navLink : { url : String, caption : String } -> Html msg
        navLink { url, caption } =
            li [ class "emailphone" ]
                [ a [ href url ] [ text caption ] ]
    in
    links



-- NAV: Cmd Msgs
-- these might e.g. be sent to ports etc.


logOutUser : Cmd Msg
logOutUser =
    sendMessageToJs "logOut"



-- NAV: Main Persistent


isHWConnectedIndicator : Bool -> Html msg
isHWConnectedIndicator isConnected =
    h3 []
        [ div [ Attr.class "indicator", Attr.style "text-align" "center" ]
            [ br [] []
            , span []
                [ span
                    [ Attr.class
                        (if isConnected then
                            "indicator green"

                         else
                            "indicator red"
                        )
                    ]
                    [ text
                        (if isConnected then
                            "Connected"

                         else
                            "Disconnected"
                        )
                    ]
                ]
            ]
        ]


isXMRWalletConnectedIndicator : Bool -> String -> Html msg
isXMRWalletConnectedIndicator isConnected xmrWalletAddress =
    h3 []
        [ div [ Attr.class "indicator", Attr.style "text-align" "center" ]
            [ br [] []
            , span []
                [ h6
                    [ Attr.class
                        (if isConnected then
                            "indicator green"

                         else
                            "indicator red"
                        )
                    ]
                    [ text
                        (if isConnected then
                            "XMR Wallet Connected"

                         else
                            "XMR Wallet Disconnected"
                        )
                    ]
                , br [] []
                , h5 []
                    [ text
                        (if isConnected then
                            "XMR Wallet Address: " ++ xmrWalletAddress

                         else
                            ""
                        )
                    ]
                ]
            ]
        ]


footerContent : Model -> Html msg
footerContent model =
    let
        newVersion =
            case model.version of
                Just { version } ->
                    version

                Nothing ->
                    "No Haveno version available"
    in
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
                , p [] [ text "Version 0.0.15" ]
                , text "Haveno Version"
                , h6 [ id "havenoversion" ]
                    [ text
                        newVersion
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
        ( Dashboard, DashboardPage _ ) ->
            True

        ( Dashboard, _ ) ->
            False

        ( Sell, SellPage _ ) ->
            True

        ( Sell, _ ) ->
            False

        ( Blank, BlankPage _ ) ->
            True

        ( Blank, _ ) ->
            False

        ( Portfolio, PortfolioPage _ ) ->
            True

        ( Portfolio, _ ) ->
            False

        ( Funds, FundsPage _ ) ->
            True

        ( Funds, _ ) ->
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

        ( Hardware, HardwarePage _ ) ->
            True

        ( Hardware, _ ) ->
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
