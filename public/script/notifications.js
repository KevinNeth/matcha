$(function () {
    var socket = io();

    socket.on('notification', function() {
        var prev = Number($('#unread-count').text());
        $('#unread-count').text(prev + 1);
    });
});