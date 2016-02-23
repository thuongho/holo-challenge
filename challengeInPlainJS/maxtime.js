function getMaxTime(arr) {
  var maxTime = [];
  arr.map(function(o) {
    // console.log(o.time);
    maxTime.push(o.time);
  });
  return Math.max.apply(null, maxTime);
}

var result = getMaxTime([{time:200}, {time:410}, {time:1000}, {time:1000.5}]);
console.log(result);