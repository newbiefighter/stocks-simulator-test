/*
 * Serve content over a socket
 */

module.exports = function(socket) {

  var getCurrentMoment = function(type) {
    var now = new Date();
    now.setMilliseconds(0);
    now = (new Date(now)).getTime();
    if (type === 'time') {
      return (new Date(now)).toTimeString().substring(0, 8);
    }
    return now;
  };

  var current = getCurrentMoment('time');
  var mockStockArray = [{
    name: 'Apple',
    last: 9.88,
    norm: 10.02,
    updated: current,
    change: 0,
    bidSize: 2430,
    bidPrice: 9.87,
    askPrice: 9.89,
    askSize: 3489
  }, {
    name: 'Google',
    last: 9.58,
    norm: 9.60,
    updated: current,
    change: 0,
    bidSize: 2430,
    bidPrice: 9.58,
    askPrice: 9.58,
    askSize: 3489
  }, {
    name: 'Yahoo',
    last: 9.48,
    norm: 9.42,
    updated: current,
    change: 0,
    bidSize: 2430,
    bidPrice: 9.48,
    askPrice: 9.48,
    askSize: 3489
  }, {
    name: 'Amazon',
    last: 9.98,
    norm: 10.02,
    updated: current,
    change: 0,
    bidSize: 2430,
    bidPrice: 9.87,
    askPrice: 9.89,
    askSize: 3489
  }, {
    name: 'Alibaba',
    last: 10.08,
    norm: 10.02,
    updated: current,
    change: 0,
    bidSize: 2430,
    bidPrice: 10.08,
    askPrice: 10.08,
    askSize: 3489
  }, {
    name: 'Microsoft',
    last: 9.58,
    norm: 9.62,
    updated: current,
    change: 0,
    bidSize: 2430,
    bidPrice: 9.58,
    askPrice: 9.58,
    askSize: 3489
  }, {
    name: 'Tecent',
    last: 10.18,
    norm: 10.12,
    updated: current,
    change: 0,
    bidSize: 2430,
    bidPrice: 10.18,
    askPrice: 10.18,
    askSize: 3489
  }];

  // push data every 0.5 second
  setInterval(function() {
    socket.emit('send:stock', {
      items: mockTwoUpdateStocks()
    });
  }, 500);

  var mockTwoUpdateStocks = function() {
    for (var i = 0; i < mockStockArray.length; i++) {
      mockStockArray[i].justUpdate = false;
    };

    var index1 = getRandomDigit(mockStockArray.length),
      index2 = getRandomDigit(mockStockArray.length, index1);
    var item1 = mockStockArray[index1];

    item1.last = Math.round((item1.last + getMockedChange()) * 100) / 100;
    item1.change = Math.round((item1.last - item1.norm) / item1.norm * 10000) / 100;

    item1.updated = getCurrentMoment();
    item1.updatedLabel = getCurrentMoment('time');
    item1.bidPrice = item1.last;
    item1.askPrice = Math.round((item1.last + 0.01) * 100) / 100;
    item1.justUpdate = true;

    var item2 = mockStockArray[index2];
    item2.last = Math.round((item2.last + getMockedChange()) * 100) / 100;
    item2.change = Math.round((item2.last - item2.norm) / item2.norm * 10000) / 100;
    item2.updated = item1.updated;
    item2.updatedLabel = item1.updatedLabel;
    item2.bidPrice = item2.last;
    item2.askPrice = Math.round((item2.last + 0.01) * 100) / 100;
    item2.justUpdate = true;

    return mockStockArray;
  };

  // simulate stock fluctuation
  var getMockedChange = function() {
    var pre = getRandomDigit(2);
    if (pre === 0) {
      return 0 - getRandomDigit(10) / 100;
    } else {
      return getRandomDigit(10) / 100;
    }
  };

  // get random integer
  var getRandomDigit = function(max, except) {
    var num = Math.floor(Math.random() * max);
    if (except && num === except) {
      return getRandomDigit(max, except);
    }

    return num;
  };
};