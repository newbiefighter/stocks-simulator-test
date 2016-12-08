app.controller('stockController', ['$scope', '$http', 'socket',
  function($scope, $http, socket) {

    var history = [];
    var selectedGroupInit = false;
    $scope.cboxGroup = [];
    $scope.data = [{
      type: "spline",
      xValueType: "dateTime",
      showInLegend: true,
      dataPoints: []
    }, {
      type: "spline",
      xValueType: "dateTime",
      showInLegend: true,
      dataPoints: []
    }, {
      type: "spline",
      xValueType: "dateTime",
      dataPoints: []
    }, {
      type: "spline",
      xValueType: "dateTime",
      dataPoints: []
    }, {
      type: "spline",
      xValueType: "dateTime",
      dataPoints: []
    }, {
      type: "spline",
      xValueType: "dateTime",
      dataPoints: []
    }, {
      type: "spline",
      xValueType: "dateTime",
      dataPoints: []
    }];

    // Listen to socket
    socket.on('send:stock', function(data) {
      $scope.stocks = data.items;
      for (var i = 0; i < data.items.length; i++) {

        if (!selectedGroupInit) {
          $scope.cboxGroup[i] = i < 2 ? true : false;
          $scope.data[i].legendText = data.items[i].name;
        }

        if (data.items[i].justUpdate) {
          maintainHistory(i, data.items[i]);
          if ($scope.cboxGroup[i] && history[i] && history[i].length > 1) {
            updateChart();
          }
        }
      }
      selectedGroupInit = true;
    });

    // Listen to tick event
    $scope.change = function() {
      for (var i = 0; i < $scope.cboxGroup.length; i++) {
        if (!$scope.cboxGroup[i]) {
          $scope.data[i].visible = false;
          $scope.data[i].showInLegend = false;
        } else {
          $scope.data[i].visible = true;
          $scope.data[i].showInLegend = true;
        }
      };
      $scope.chart.render();
      console.log($scope.cboxGroup);
    };

    // Rerender
    var updateChart = function() {
      var needRender = false;
      for (var i = 0; i < $scope.cboxGroup.length; i++) {
        if ($scope.cboxGroup[i]) {
          $scope.data[i].dataPoints = history[i];
          needRender = (history[i] && history[i].length > 1) ? true : false;       
        }
      }
      if (needRender) {
        $scope.chart.render();
      }
    };

    // Retain latest push data by period
    var maintainHistory = function(i, item) {
      if (!history[i]) {
        history[i] = [];
      } else if (history[i].length > 20) {
        history[i].shift();
      }
      var chartData = {
        x: item.updated,
        y: item.last
      };
      history[i].push(chartData);
    };

  }
]);

app.directive('myChart', ['$interval', 'dateFilter', function($interval, dateFilter) {
  return {
    link: function($scope, element, attr) {

      $scope.chart = new CanvasJS.Chart("chartContainer", {
        title: {
          text: "Dynamic Data"
        },
        toolTip: {
          contentFormatter: function(e) {
            var content = "";
            for (var i = 0; i < e.entries.length; i++) {
              content = CanvasJS.formatDate(e.entries[i].dataPoint.x, "HH:mm:ss") + ' ' + e.entries[i].dataPoint.y;
            }
            return content;
          }
        },
        axisX: {
          interval: 5,
          intervalType: "second",
          valueFormatString: "HH:mm:ss",
          labelAngle: -50
        },
        axisY: {
          minimum: 8,
          maximun: 12,
          interval: 0.5
        },
        data: $scope.data
      });

      $scope.chart.render();
    }
  }
}]);