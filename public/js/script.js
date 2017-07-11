var socket = io();
var population = [];
var settings = {
  width: 640,
  height: 480,
  lobbys: [],
};
var container = $("#window");

function init() {
  container.css({
    width: settings.width,
    height: settings.height,
  })
  population.forEach(function(obj, ind) {
    var person = $("<div class='bot' id='" + obj.id + "'><div class='balloon-wrapper'><div class='balloon animated infinite rubberBand'><span></span><span></span><span></span></div></div><span class='bot-name'>" + obj.name + "</span><div class='bot-image'><img src='" + obj.avatar + "'/></div></div>");
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
  settings = data.world;
  population = data.population;
  data.population.forEach(function(obj) {
    $('#' + obj.id).css({
      top: obj.y,
      left: obj.x
    }).attr({
      'data-talking': obj.chatting,
      'data-conversation': obj.conversation,
    });
  });
});

$(document).on('click', '[data-conversation]', function() {
  var conversationIndex = parseInt($(this).attr('data-conversation'));
  var lobby = settings.lobbys[conversationIndex];
  console.log(lobby);
});
