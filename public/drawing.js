$(document).ready(function () {
  // declare variables
  let color = "black";
  let width = 1;
  let isDown = false;
  let newPoint, oldPoint;

  // connect socket
  const socket = io.connect();

  // canvas
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // connect mouse event
  $(canvas).mousedown(function (event) {
    isDown = true;
    oldPoint = {
      x: event.pageX - $(this).position.left,
      y: event.pagey - $(this).position.top,
    };
  });

  $(canvas).mousemove(function (event) {
    if (!isDown) {
      return;
    }
    newPoint = {
      x: event.pageX - $(this).position.left,
      y: event.pagey - $(this).position.top,
    };
    socket.emit("line", {
      x1: oldPoint.x,
      y1: oldPoint.y,
      x2: newPoint.x,
      y2: newPoint.y,
      color: color,
      width: width,
    });
    oldPoint = newPoint;
  });

  $(canvas).mouseup(function (event) {
    isDown = false;
    oldPoint = {
      x: event.pageX - $(this).position.left,
      y: event.pagey - $(this).position.top,
    };
  });

  // 입력 양식 이벤트 연결
  $("#pen").click(function () {
    width = 1;
    color = "black";
    $("#width").val(width);
  });

  $("#eraser").click(function () {
    width = 10;
    color = "white";
    $("#width").val(width);
  });

  $("#width").change(function () {
    width = $(this).val();
  });

  // connect socket event
  socket.on("line", function (data) {
    context.beginPath();
    context.lineWidth = data.width;
    context.strokeStyle = data.color;
    context.moveTo(data.x1, data.y1);
    context.lineTo(data.x2, data.y2);
    context.stroke();
  });
});
