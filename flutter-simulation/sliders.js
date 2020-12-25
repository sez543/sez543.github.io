$(document).ready(function() {
  $(".al-val").html($("#alignment").val());
  $(".ch-val").html($("#cohesion").val());
  $(".sp-val").html($("#separation").val());
});

document.getElementById("alignment").addEventListener("input", function() {
  $(".al-val").html($("#alignment").val());
});

document.getElementById("cohesion").addEventListener("input", function() {
  $(".ch-val").html($("#cohesion").val());
});

document.getElementById("separation").addEventListener("input", function() {
  $(".sp-val").html($("#separation").val());
});
