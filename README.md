[![Maintainability](https://api.codeclimate.com/v1/badges/f76779b61740f270d00c/maintainability)](https://codeclimate.com/github/matthewturner/smartheat-clients/maintainability) [![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

# SmartHeat Clients

Part of the SmartHeat solution, these clients wrap around the supported thermostats.

## Testing

To test your device before getting involved in hosting the lambda:

1. Clone this repo
1. Copy `./scripts/test.sample.sh` to `./scripts/test.sh`
1. Edit `./scripts/test.sh`
1. Enter the relevant details in the environment variables (`THERMOSTAT_TYPE` is the require path, eg `../clients/Heatmiser`)

**NB** If you are using the Heatmiser thermostat, the HOST should be the local hostname/ip address on your local network
