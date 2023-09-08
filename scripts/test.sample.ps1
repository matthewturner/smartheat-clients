# copy this file as test.ps1 and add the values
# to test the command:
#    "Turn on"

$env:USERNAME = ""
$env:PASSWORD = ""
$env:HASH_PASSWORD = "false"
$env:TARGET_TEMPERATURE = "22"
$env:THERMOSTAT_TYPE = "Salus"
$env:HOST = ""
$env:MODEL = ""
$env:PORT = ""
$env:PIN = ""

node ./scripts/test.js