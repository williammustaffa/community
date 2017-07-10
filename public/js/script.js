var socket = io();
var population = [];
var settings = {
  width: 640,
  height: 480
};

function init() {
  var container = $("#window");
  container.css({
    width: settings.width,
    height: settings.height,
  })
  population.forEach(function(obj, ind) {
    var person = $("<div class='bot' id='" + obj.id + "'><span class='bot-name'>" + obj.name + "</span><div class='bot-image'><img src='" + obj.avatar + "'/></div></div>");
    person.css({
      top: obj.y,
      left: obj.x,
    });
    container.append(person);
  });
}

socket.on('DataPackage', function(data) {
  population = data.population;
  settings = data.world;
  init();
});

socket.on('DataUpdate', function(data) {
  data.population.forEach(function(obj) {
    $('#' + obj.id).css({
      top: obj.y,
      left: obj.x
    });
  });
});
