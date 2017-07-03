'use strict'

var _ = require('underscore');

// return array of block. block=array of lines belongs to 1 network device
function breakIntoBlocks(fullText) {
    var blocks = [];
    var lines = fullText.split('\n');
    var currentBlock = [];
    lines.forEach(function(line) {
        if (line.length > 0 && ['\t', ' '].indexOf(line[0]) === -1 && currentBlock.length > 0) { // start of a new block detected
            blocks.push(currentBlock);
            currentBlock = [];
        }
        if (line.trim()) {
            currentBlock.push(line);
        }
    });
    if (currentBlock.length > 0) {
       blocks.push(currentBlock); 
    }
    return blocks;
}



//7: eth5: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
//    link/ether 00:11:a3:11:4b:63 brd ff:ff:ff:ff:ff:ff promiscuity 0 numtxqueues 1 numrxqueues 1 
//    inet 192.168.41.133/22 brd 192.168.43.255 scope global dynamic eth5
//       valid_lft 74926sec preferred_lft 74926sec
//    inet6 fe80::1391:2136:a3f6:5179/64 scope link 
//       valid_lft forever preferred_lft forever
//    RX: bytes  packets  errors  dropped overrun mcast   
//    106583292  522705   0       0       0       2576    
//    TX: bytes  packets  errors  dropped carrier collsns 
//    1614107894 1084848  0       0       0       0   

// input:
// eth0      Link encap:Ethernet  HWaddr 04:01:d3:db:fd:01  
//           inet addr:107.170.222.198  Bcast:107.170.223.255  Mask:255.255.240.0
//           inet6 addr: fe80::601:d3ff:fedb:fd01/64 Scope:Link
//           UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
//           RX packets:50028 errors:0 dropped:0 overruns:0 frame:0
//           TX packets:50147 errors:0 dropped:0 overruns:0 carrier:0
//           collisions:0 txqueuelen:1000 
//           RX bytes:13590446 (13.5 MB)  TX bytes:14465813 (14.4 MB)
function parseSingleBlock(block) {
    var data = {};
    block.forEach(function(line,index) {
        var match = null;
        if(match = line.match(/^\d+:\s(\S+):/)) { //7: eth5: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
            data.device = match[1];
            var link = {};
            match = line.match(/state (\S+)/);
            if (match) {
                link.state = match[1];
            }
            data.link = link;
	} else if(match = line.match(/link\/ether/)) { //    link/ether 00:11:a3:11:4b:63 brd ff:ff:ff:ff:ff:ff
	    if (match = line.match(/ether (\S+)/)) {
                data.link.hwaddr = match[1];
            }
        } else if(match = line.match(/inet /)) {  //inet 192.168.41.133/22 brd 192.168.43.255 scope global dynamic eth5
            var inet = {};
            if (match = line.match(/inet (\S+)/)) {
                inet.addr = match[1];
            }
	    data.inet = inet;

        } else if(match = line.match(/^\s+inet6\s+/)) { // inet6 addr: fe80::601:d3ff:fedb:fd01/64 Scope:Link
            var inet6 = {};
            if (match = line.match(/inet6 (\S+)/)) {
                inet6.addr = match[1];
            }
            if (match = line.match(/scope (\S+)/)) {
                inet6.scope = match[1];
            }
            data.inet6 = inet6;
        } else if(match = line.match(/^\s+RX:/)) { //RX: bytes  packets  errors  dropped overrun mcast
            var section = {};
            var line = block[index+1];
	    match = line.match(/\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
            section.bytes = parseInt(match[1]);
            section.packets = parseInt(match[2]);
            section.errors = parseInt(match[3]);
            section.dropped = parseInt(match[4]);
            section.overrun = parseInt(match[5]);
            data.rx = section;
        } else if(match = line.match(/^\s+TX:/)) { // TX packets:50147 errors:0 dropped:0 overruns:0 carrier:0
	    var section = {};
            var line = block[index+1];
            match = line.match(/\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
            section.bytes = parseInt(match[1]);
            section.packets = parseInt(match[2]);
            section.errors = parseInt(match[3]);
            section.dropped = parseInt(match[4]);
            section.overrun = parseInt(match[5]);
            data.tx = section;

        } else {
        }
    });
    return data;
}

// return a well-parsed object
function parser(fullText) {
    var blocks = breakIntoBlocks(fullText);
    var map = {};
    _.map(blocks, function(block) {
        var obj = parseSingleBlock(block);
        map[obj.device] = obj;
    });
    return map;
}

module.exports = parser;
