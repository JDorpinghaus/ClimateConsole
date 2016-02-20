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
    url: 'https://hackillinois.climate.com/api/fields?includeBoundary=true',
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
    var coords = new Array(element.boundary.coordinates.length);
    $.each(coords, function(ind, el){
      coords[ind] = [];
      $.each(element.boundary.coordinates[ind][0], function(inde, elemen){
        coords[ind].push({lat: elemen[1], lng: elemen[0]});
      });
    });
    newMarker(Map, element.centroid.coordinates[1], element.centroid.coordinates[0], element.name);
    console.log("field " + index + " marked at " + element.centroid.coordinates[1] + ' , ' + element.centroid.coordinates[0]);
    $.each(coords, function(index, element){
      console.log(element);
      var polygon = new google.maps.Polygon({
        map: Map,
        paths: element,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
    });
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