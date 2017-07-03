# ipaddr-linux

Wrap ip -s addr and parse result to json format (work on linux, not work on mac).


# Command-line Example
``` js
{ lo: 
   { device: 'lo',
     link: { state: 'UNKNOWN' },
     inet: { addr: '127.0.0.1/8' },
     inet6: { addr: '::1/128', scope: 'host' },
     rx: 
      { bytes: 1154563,
        packets: 16185,
        errors: 0,
        dropped: 0,
        overrun: 0 },
     tx: 
      { bytes: 1154563,
        packets: 16185,
        errors: 0,
        dropped: 0,
        overrun: 0 } },
  eth0: 
   { device: 'eth0',
     link: { state: 'DOWN', hwaddr: '50:7b:9d:68:02:a3' },
     rx: { bytes: 0, packets: 0, errors: 0, dropped: 0, overrun: 0 },
     tx: { bytes: 0, packets: 0, errors: 0, dropped: 0, overrun: 0 } },
  wlan0: 
   { device: 'wlan0',
     link: { state: 'UP', hwaddr: 'dc:53:60:6b:32:bc' },
     inet: { addr: '192.168.1.42/24' },
     inet6: { addr: 'fe80::de53:60ff:fe6b:32bc/64', scope: 'link' },
     rx: 
      { bytes: 184690386,
        packets: 361847,
        errors: 0,
        dropped: 0,
        overrun: 0 },
     tx: 
      { bytes: 125560762,
        packets: 209219,
        errors: 0,
        dropped: 0,
        overrun: 0 } },
  docker0: 
   { device: 'docker0',
     link: { state: 'DOWN', hwaddr: '02:42:20:91:4e:d1' },
     inet: { addr: '172.17.0.1/16' },
     rx: { bytes: 0, packets: 0, errors: 0, dropped: 0, overrun: 0 },
     tx: { bytes: 0, packets: 0, errors: 0, dropped: 0, overrun: 0 } } }

```

# API Example
In addition to ipaddr-linux shell command-line, you can also `require('ipaddr-linux')` from your node.js application as you wish.
``` js
var promise = require('ipaddr-linux')(); // this return a promise
promise.then(console.dir);
```

# How it works
This module is based on `ip -s addr` linux command. It's tested and works on Ubuntu 17.04

# install

With [npm](https://npmjs.org) do:

```
npm install ipaddr-linux -g
```

# license

MIT
