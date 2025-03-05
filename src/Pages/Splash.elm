module Pages.Splash exposing (Model, Msg, Splash(..), Status(..), init, update, view)

{-| The Splashpage. You can get here via either the / or /#/ routes.
-}

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
    , root : Splash
    , balances : Maybe Protobuf.BalancesInfo
    , primaryaddress : String
    , version : String
    , errors : List String
    }



-- Define your initialModel with default values


type Splash
    = Splash
        { name : String
        }


type Status
    = Loading



{- -- NOTE: by calling (from Main) Tuple.first (Splash.init ()) , we’ll end up with
   the Splash.Model value we seek. () means we don't really care what goes in, we just
   want the output (in this case the model (slightly modified))
-}
-- NAV: Init


init : FromMainToSplash -> ( Model, Cmd Msg )
init fromMainToSplash =
    let
        newModel =
            Model Loading "Splash" (Splash { name = "Loading..." }) Nothing "" fromMainToSplash.havenoVersion []
    in
    ( newModel
    , Cmd.none
    )


type Msg
    = NoOp



-- NAV: Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )



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



-- NAV: Type Aliases


type alias FromMainToSplash =
    { time : Maybe DateTime
    , havenoVersion : String
    }
