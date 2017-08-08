// client-side js
// run by the browser each time your view template is loaded

// if (typeof io === 'undefined') { var io = {}; }

$(function() {
  var tapHandler = function() {};
  var socket = io.connect('/');
  
  function createShape(location) {
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    location = {
      x: location.x * width,
      y: location.y * height
    };
    var newShape = document.createElement('div');
    newShape.style.width = '0px';
    newShape.style.height = '0px';
    newShape.style.position = 'absolute';
    newShape.style.top = location.y + 'px';
    newShape.style.left = location.x + 'px';
    newShape.style.border = '1px solid white';
    newShape.style.borderRadius = '30px';
    newShape.style.transition = 'opacity 0.2s, width 0.5s, height 0.5s, top 0.5s, left 0.5s';

    document.body.appendChild(newShape);
    
    setTimeout(animateIn, 50);
    
    function animateIn() {
      newShape.style.width = '60px';
      newShape.style.height = '60px';
      newShape.style.top = location.y - 30 + 'px';
      newShape.style.left = location.x - 30 + 'px';
      
      setTimeout(animateOut, 2000);
    }
    
    function animateOut() {
      newShape.style.opacity = 0;

      setTimeout(function() {
        newShape.remove();
      }, 500);
    }
  }
  
  socket.on('connect', function(arg) {    
    tapHandler = function(e) {
      var width = document.body.clientWidth;
      var height = document.body.clientHeight;
      var location = {
        x: e.pageX / width,
        y: e.pageY / height
      };
      createShape(location);
      socket.emit('tap', {location: location});
    };
  });
  
  socket.on('tap', function(data) {
    var location = data.location;
    createShape(location);
  });

  document.addEventListener('click', function(e) { tapHandler(e); });
  
  // Lock scroll.
  var preventDefault = function(e) {
    if (e && e.preventDefault) { e.preventDefault() }
    return false;
  }
  window.onwheel = preventDefault;
  window.ontouchmove = preventDefault;
  window.onmousewheel = preventDefault;
});
