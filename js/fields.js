/* global google */
var Map;

$(document).ready(function() {
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
  $.ajax({
    url: 'https://hackillinois.climate.com/api/fields?includeBoundary=true',
    xhrFields: {
      withCredentials: true,
    },
    dataType: 'json',
    success: function(d) {
      console.log('Loaded ' + d.fields.length + ' fields:');
      console.log(d);
      markFields(d);
      loadList(d);
      loadClicks(d);
      populateWeather(d);
      centerMap(d.fields[0].centroid.coordinates[1], d.fields[0].centroid.coordinates[0]);
    },
    error: function(error) {
      console.log('error: ');
      console.log(error);
    }
  });
}

function markFields(d){
  $.each(d.fields, function(index, element){
    var coords = new Array(element.boundary.coordinates.length);
    $.each(coords, function(ind, el){
      coords[ind] = [];
      $.each(element.boundary.coordinates[ind][0], function(inde, elemen){
        coords[ind].push({lat: elemen[1], lng: elemen[0]});
      });
    });
    newMarker(Map, element.centroid.coordinates[1], element.centroid.coordinates[0], element.name);
    $.each(coords, function(index, element){
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
  $.each(d.fields, function(index, element){
    $("#fieldList").append(`
      <div class="field" id="field` + index + `">
        <p class="fieldTitle">` + element.name + `</p>
        <div class="fieldDetail" id="field` + index + `Detail" visible="false" style="display: none">
          <p class="fieldText">Current Weather: <i class="weatherIcon" id="weatherIcon_` + element.id + `"></p>
          <p class="fieldText">Area: ` + element.area.q + element.area.u + `</p>
          <p class="fieldText"><img class="fieldicon" src="css/img/addNoteIcon.png">Notes: </p>
          <p class="fieldText"><img class="fieldIcon" src="css/img/plantIcon.png">Activities: </p>
        </div>
      </div>`);
  });
}

function loadClicks(d){
  $(".field").each(function(index){
    $(this).click(function(){
      Map.panTo({lat: d.fields[index].centroid.coordinates[1], lng: d.fields[index].centroid.coordinates[0]});
      if ($(this).children(".fieldDetail").attr('visible') == 'true'){
        $(this).children(".fieldDetail").attr('visible', 'false');
      } else {
        $(this).children(".fieldDetail").attr('visible', 'true');
      }
      $(this).children(".fieldDetail").animate({height: 'toggle'}, 200, function(){});
      $(this).siblings(".field").children(".fieldDetail").each(function(index, element){
        if ($(element).attr('visible') == 'true'){
          $(element).animate({height: 'toggle'}, 200, function(){});
          $(element).attr('visible', 'false');
        }
      });
    });
  });
}

function loadWeather(div, lat, lon){
  $.simpleWeather({
    location: lat+','+lon,
    woeid: '',
    unit: 'f',
    success: function(weather) {
      $(div).addClass("icon-" + weather.code);
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function populateWeather(d){
  $.each(d.fields, function(index, element){
    loadWeather("#weatherIcon_" + element.id, element.centroid.coordinates[1], element.centroid.coordinates[0]);
  });
}

function centerMap(lat, long){
  Map.setCenter({lat: lat, lng: long});
  $("#field0").click();
}