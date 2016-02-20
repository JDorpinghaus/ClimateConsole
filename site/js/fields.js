/* global google */
var Map;

$(document).ready(function() {
    console.log( "Starting scripts" );
    listFields();
});

function initMap() {
  Map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.8282, lng: -98.5795},
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });
}

function listFields(){
  console.log("Requesting fields");
  $.ajax({
    url: 'https://hackillinois.climate.com/api/fields/',
    xhrFields: {
      withCredentials: true,
    },
    dataType: 'json',
    success: function(d) {
      console.log('fields loaded');
      markFields(d);
      loadList(d);
      loadClicks(d);
    },
    error: function(error) {
      console.log('error: ');
      console.log(error);
    }
  });
}

function markFields(d){
  console.log('marking fields');
  $.each(d.fields, function(index, element){
    newMarker(Map, element.centroid.coordinates[1], element.centroid.coordinates[0], element.name);
    console.log("field " + index + " marked at " + element.centroid.coordinates[1] + ' , ' + element.centroid.coordinates[0]);
  });
}

function newMarker(map, lat, long, title){
  var infowindow = new google.maps.InfoWindow({
      content: title
  });
  var marker = new google.maps.Marker({
    position: {lat: lat, lng: long},
    map: map,
    title: title
  });
  google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
}

function getUsername(element){
  $.ajax({
    url: 'https://hackillinois.climate.com/api/users/details',
    xhrFields: {
      withCredentials: true,
    },
    dataType: 'json',
    Authorization: '', //How to get userid/email address from current user?
    success: function(d) {
      $("#" + element).text('Welcome, ' + d.UserDetails.firstname);
    },
    error: function(error) {
      console.log('error: ');
      console.log(error);
    }
  });
}

function loadList(d){
  console.log('loadlist');
  console.log(d);
  $.each(d.fields, function(index, element){
    $("#fieldList").append(`
      <div class="field" id="field` + index + `>
        <p class="fieldTitle">` + element.name + `</p>
      </div>
    `);
  });
}

function loadClicks(d){
  $(".field").each(function(index){
    $(this).click(function(){
      console.log(this);
      Map.panTo({lat: d.fields[index].centroid.coordinates[1], lng: d.fields[index].centroid.coordinates[0]});
    });
  });
}