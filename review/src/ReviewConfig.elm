module ReviewConfig exposing (config)

{-| Do not rename the ReviewConfig module or the config function, because
`elm-review` will look for these.

To add packages that contain rules, add them to this review project using

    `elm install author/packagename`

when inside the directory containing this file.

-}



import Review.Rule exposing (Rule)
import NoUnused.Variables
import NoUnused.CustomTypeConstructors
import NoUnused.Modules
import NoExposingEverything  -- ✅ Prevents `exposing (..)`
import Review.Rule exposing (Rule)
import Review.FilePattern

config : List Rule
config =
    [ NoUnused.Variables.rule
    , NoUnused.CustomTypeConstructors.rule []
    , NoUnused.Modules.rule
    , NoExposingEverything.rule  -- ✅ Prevents `exposing (..)`
    ]
       |> List.map (Review.Rule.ignoreErrorsForDirectories [ "src/Proto" ])

