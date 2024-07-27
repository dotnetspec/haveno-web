port module BddStepDefinitions.Runner exposing
  ( program
  , browserProgram
  , skip
  , pick
  )

import Spec exposing (Message)

port elmSpecOut : Message -> Cmd msg
port elmSpecIn : (Message -> msg) -> Sub msg
port elmSpecPick : () -> Cmd msg

config : Spec.Config msg
config =
  { send = elmSpecOut
  , listen = elmSpecIn
  }

pick : Spec.Scenario model msg -> Spec.Scenario model msg
pick =
  Spec.pick elmSpecPick

skip : Spec.Scenario model msg -> Spec.Scenario model msg
skip =
  Spec.skip

program : List (Spec.Spec model msg) -> Program Spec.Flags (Spec.Model model msg) (Spec.Msg msg)
program =
  Spec.program config

browserProgram : List (Spec.Spec model msg) -> Program Spec.Flags (Spec.Model model msg) (Spec.Msg msg)
browserProgram =
  Spec.browserProgram config