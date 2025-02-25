module Extras.Constants exposing (..)

import Url exposing (Protocol(..), Url)



-- NOTE: Constants for testing, must match the code


blankAddress : String
blankAddress =
    "************************"


donationAddress : String
donationAddress =
    "86F2Vbx6QRL3jfxeACFUsPTAh2x264dDNdgmt8m96zSQd8rwGrsw4th7XrmdhQkFXf32timtpWupQMWokagkXYfiPKYGvpt"


xmrConversionConstant : number
xmrConversionConstant =
    4294967296


localhostForElmSpecProxyURL : Url
localhostForElmSpecProxyURL =
    Url Http "localhost" (Just 3000) "/proxy" Nothing Nothing



-- NOTE: Potential point of failure when switching between dev and prod


localorproductionServerAutoCheck : String
localorproductionServerAutoCheck =
    "haveno-web.squashpassion"


placeholderUrl : Url
placeholderUrl =
    Url Http "localhost" (Just 3000) "" Nothing Nothing


post : String
post =
    "POST"


get : String
get =
    "GET"
