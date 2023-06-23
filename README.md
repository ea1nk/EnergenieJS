# EnergenieJS Class
2023 SCQ Devices - EA1NK

## Node JS Energenie PM2Lan JS class

You need to declare in your .env file socket ip address, username and password

```
energenieIP=<your powerstrip ip address>
energeniePASSWORD=<your powerstrip password>
energenieUSER=<your powerstrip user>
```

# Usage

Include the energenie.js class in your main app

```
const EnerGenieStrip = require(./energenie.js)
const enerGenieSwitcher = new EnerGenieStrip()

//Turn ON first socket
enerGenieSwitcher.doSwitch({
    1:EnergenieSwitcher.ON
    })

//Turn ON all sockets
enerGenieSwitcher.doSwitch({
  1: EnerGenieSwitcher.ON,
  2: EnerGenieSwitcher.ON,
  3: EnerGenieSwitcher.ON,
  4: EnerGenieSwitcher.ON,
  })

//Turn OFF all sockets
//Turn ON all sockets
enerGenieSwitcher.doSwitch({
  1: EnerGenieSwitcher.OFF,
  2: EnerGenieSwitcher.OFF,
  3: EnerGenieSwitcher.OFF,
  4: EnerGenieSwitcher.OFF,
  })

```

