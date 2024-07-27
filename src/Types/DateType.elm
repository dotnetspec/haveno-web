module Types.DateType exposing (..)

import Derberos.Date.Core as DD
import String exposing (split)
import Time



-- NOTE: This module may be expanded later on to include further date manipulation and validation functionality.
-- For now, just this very simple check on the format we're getting from Zoho


type DateTime
    = CurrentDateTime Time.Posix Time.Zone
    | SelectedDateTime Time.Posix Time.Zone


convertPosixTimeToCurrentDateTime : Time.Posix -> DateTime
convertPosixTimeToCurrentDateTime time = 
    CurrentDateTime time Time.utc
-- Function to extract the hour from the TIME (not datetime) string


extractYear : String -> String
extractYear timeString =
    case split "-" timeString of
        [ year, _, _ ] ->
            year

        _ ->
            "Invalid time format"


extractMonth : String -> String
extractMonth timeString =
    case split "-" timeString of
        [ _, month, _ ] ->
            month

        _ ->
            "Invalid time format"


extractDay : String -> String
extractDay timeString =
    case split "-" timeString of
        [ _, _, day ] ->
            day

        _ ->
            "Invalid time format"


extractHour : String -> String
extractHour timeString =
    case split ":" timeString of
        [ hour, _, _ ] ->
            hour

        _ ->
            "Invalid time format"


-- Function to extract the year from a date-time string
extractForConfirmationYear : String -> String
extractForConfirmationYear timeString =
    case String.split " " timeString of
        [ datePart, _ ] ->
            case String.split "-" datePart of
                [ _, _, year ] ->
                    
                    year

                _ ->
                    "Invalid date format"

        _ ->
            "Invalid date-time format"


extractForConfirmationMonth : String -> String
extractForConfirmationMonth timeString =
    case split "-" timeString of
        [ _, month, _ ] ->
             month

        _ ->
            "Invalid time format"


extractForConfirmationDay : String -> String
extractForConfirmationDay timeString =
    case split "-" timeString of
        [ day, _, _ ] ->
            day

        _ ->
            "Invalid time format"


-- Function to extract the hour from a date-time string
extractForConfirmationHour : String -> String
extractForConfirmationHour timeString =
    case String.split " " timeString of
        [ _, timePart ] ->
            case String.split ":" timePart of
                [ hour, _, _ ] ->
                    
                    
                    format12Hour (Maybe.withDefault 0 (String.toInt hour))

                _ ->
                    "Invalid time format"

        _ ->
            "Invalid date-time format"

extractForConfirmationHourForDateRecord : String -> Int
extractForConfirmationHourForDateRecord timeString =
    case String.split " " timeString of
        [ _, timePart ] ->
            case String.split ":" timePart of
                [ hour, _, _ ] ->
                    Maybe.withDefault 0 (String.toInt hour)

                _ ->
                    0

        _ ->
            0

extractForConfirmationMonthForDateRecord : String -> Int
extractForConfirmationMonthForDateRecord timeString =
    case split "-" timeString of
        [ _, month, _ ] ->
            Maybe.withDefault 0 (String.toInt (stringNamedMonthToDigital month))

        _ ->
            0


convertStringDateTimeToDateRecord : String -> DD.DateRecord
convertStringDateTimeToDateRecord datetime =
    DD.DateRecord (Maybe.withDefault 0 (String.toInt (extractForConfirmationYear datetime)))
        (extractForConfirmationMonthForDateRecord datetime)
        (Maybe.withDefault 0 (String.toInt (extractForConfirmationDay datetime)))
        (extractForConfirmationHourForDateRecord datetime)
        0
        0
        0
        Time.utc


reorderTimeList : List String -> List String
reorderTimeList timeList =
    let
        noonTime =
            "12:00 PM"

        beforeNoon =
            List.filter (\time -> time < noonTime) timeList

        afterNoon =
            List.filter (\time -> time > noonTime) timeList
    in
    List.concat [ List.sort beforeNoon, [ noonTime ], List.sort afterNoon ]


removeDateAndParseTime : String -> String
removeDateAndParseTime input =
    -- Extract the time portion "HH:mm:ss"
    case String.split " " input of
        [ _, time ] ->
            time

        _ ->
            "Invalid input"


removeTimeAndParseDate : String -> String
removeTimeAndParseDate input =
    -- Extract the date portion "dd-Mmm-YYYY"
    case String.split " " input of
        [ date, _ ] ->
            date

        _ ->
            "Invalid input"


namedMonth : Time.Month -> String
namedMonth month =
    case month of
        Time.Jan ->
            "Jan"

        Time.Feb ->
            "Feb"

        Time.Mar ->
            "Mar"

        Time.Apr ->
            "Apr"

        Time.May ->
            "May"

        Time.Jun ->
            "Jun"

        Time.Jul ->
            "Jul"

        Time.Aug ->
            "Aug"

        Time.Sep ->
            "Sep"

        Time.Oct ->
            "Oct"

        Time.Nov ->
            "Nov"

        Time.Dec ->
            "Dec"


monthInDigital : Time.Month -> String
monthInDigital month =
    case month of
        Time.Jan ->
            "01"

        Time.Feb ->
            "02"

        Time.Mar ->
            "03"

        Time.Apr ->
            "04"

        Time.May ->
            "05"

        Time.Jun ->
            "06"

        Time.Jul ->
            "07"

        Time.Aug ->
            "08"

        Time.Sep ->
            "09"

        Time.Oct ->
            "10"

        Time.Nov ->
            "11"

        Time.Dec ->
            "12"


stringNamedMonthToDigital : String -> String
stringNamedMonthToDigital month =
    case month of
        "Jan" ->
            "01"

        "Feb" ->
            "02"

        "Mar" ->
            "03"

        "Apr" ->
            "04"

        "May" ->
            "05"

        "Jun" ->
            "06"

        "Jul" ->
            "07"

        "Aug" ->
            "08"

        "Sep" ->
            "09"

        "Oct" ->
            "10"

        "Nov" ->
            "11"

        "Dec" ->
            "12"

        _ ->
            "01"


dayInDigital : Time.Posix -> String
dayInDigital time =
    if Time.toDay Time.utc time < 10 then
        "0" ++ String.fromInt (Time.toDay Time.utc time)

    else
        String.fromInt (Time.toDay Time.utc time)



-- NOTE: For Zoho needs to be "30-Apr-2019 22:00:00"


posixTimeDateForQueryString : Time.Posix -> String
posixTimeDateForQueryString time =
    dayInDigital time
        ++ "-"
        ++ (namedMonth <| Time.toMonth Time.utc time)
        ++ "-"
        ++ (String.fromInt <| Time.toYear Time.utc time)
        ++ " "
        ++ (String.fromInt <| Time.toHour Time.utc time)
        ++ ":00:00"


posixTimeDateForUI : Time.Posix -> String
posixTimeDateForUI time =
    dayInDigital time
        ++ "-"
        ++ (namedMonth <| Time.toMonth Time.utc time)
        ++ "-"
        ++ (String.fromInt <| Time.toYear Time.utc time)
        ++ " "
        ++ format12Hour (Time.toHour Time.utc time)


posixDateOnlyForAvailUI : Time.Posix -> String
posixDateOnlyForAvailUI time =
    dayInDigital time
        ++ "-"
        ++ (namedMonth <| Time.toMonth Time.utc time)
        ++ "-"
        ++ (String.fromInt <| Time.toYear Time.utc time)



-- Function to extract and format hours in 12-hour format


format12Hour : Int -> String
format12Hour hour =
    let
        formattedHour =
            if hour == 0 then
                12

            else if hour > 12 then
                hour - 12

            else
                hour

        
    in
    String.fromInt formattedHour
        ++ " "
        ++ (if hour < 12 then
                "AM"

            else
                "PM"
           )


convertSelectedStringDateToPosix8AMThatDay : String -> Time.Posix
convertSelectedStringDateToPosix8AMThatDay selDate =
    let
        newDateRec =
            DD.DateRecord (Maybe.withDefault 0 (String.toInt (extractYear selDate)))
                (Maybe.withDefault 0 (String.toInt (extractMonth selDate)))
                (Maybe.withDefault 0 (String.toInt (extractDay selDate)))
                8
                0
                0
                0
                Time.utc

        posixTime =
            DD.civilToPosix newDateRec
    in
    posixTime


convertToPosixTopOfTheHour : Time.Posix -> String -> Time.Posix
convertToPosixTopOfTheHour posixTimeDate formattedTime =
    let
        timeParts =
            String.split ":" formattedTime

        hours =
            Maybe.withDefault 0 (String.toInt (Maybe.withDefault "0" (List.head timeParts)))

        posixTime =
            createPosixWithHour hours posixTimeDate
    in
    posixTime



-- Function to create a Posix timestamp with a specific hour


createPosixWithHour : Int -> Time.Posix -> Time.Posix
createPosixWithHour targetHours currentPosix =
    let
        newDateRec =
            DD.posixToCivil currentPosix

        updatedDateRec =
            { newDateRec | hour = targetHours }

        posixTime =
            DD.civilToPosix updatedDateRec
    in
    posixTime
