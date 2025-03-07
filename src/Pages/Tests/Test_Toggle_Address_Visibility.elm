module Pages.Tests.Test_Toggle_Address_Visibility exposing (tests)

import Extras.Constants as Constants
import Extras.TestData as TestData
import Pages.Funds exposing (Msg(..), update, view)
import Test exposing (Test, describe, test)
import Test.Html.Query as Query
import Test.Html.Selector


tests : Test
tests =
    describe "Toggle visibility functionality"
        [ test "Check if obscured address is being rendered" <|
            \_ ->
                let
                    initialModel =
                        Pages.Funds.initialModel

                    updatedModel =
                        { initialModel
                            | status = Pages.Funds.Loaded
                            , isAddressVisible = False
                            , primaryaddress = TestData.primaryAddress
                        }

                    rendered =
                        view updatedModel |> Query.fromHtml
                in
                rendered |> Query.has [ Test.Html.Selector.text Constants.blankAddress ]
        , test "Clicking 'Show' reveals the text" <|
            \_ ->
                let
                    initialModel =
                        Pages.Funds.initialModel

                    updatedModel =
                        { initialModel | status = Pages.Funds.Loaded, isAddressVisible = False, primaryaddress = TestData.primaryAddress }

                    ( newModel, _ ) =
                        update ToggleFundsVisibility updatedModel

                    rendered =
                        view newModel |> Query.fromHtml
                in
                rendered
                    |> Query.has [ Test.Html.Selector.containing [ Test.Html.Selector.text TestData.primaryAddress ] ]
        , test "Clicking 'Hide' obscures the text again" <|
            \_ ->
                let
                    initialModel =
                        Pages.Funds.initialModel

                    updatedModel =
                        { initialModel | status = Pages.Funds.Loaded, isAddressVisible = True, primaryaddress = TestData.primaryAddress }

                    ( newModel, _ ) =
                        update ToggleFundsVisibility updatedModel

                    rendered =
                        view newModel |> Query.fromHtml
                in
                rendered
                    |> Query.has [ Test.Html.Selector.containing [ Test.Html.Selector.text Constants.blankAddress ] ]
        ]
