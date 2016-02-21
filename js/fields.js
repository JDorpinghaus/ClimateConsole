/* global google */

var json=`{
	"notes": [{
		"user": "user1",
		"field": "24616313",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616312",
		"note": "Too much fertilizer last month"
	}, {
		"user": "user1",
		"field": "24616304",
		"note": "Need more water"
	}, {
		"user": "user1",
		"field": "24616311",
		"note": "Rotate crops more often"
	}, {
		"user": "user1",
		"field": "24616312",
		"note": "More fertilizer than last month"
	}, {
		"user": "user1",
		"field": "24616607",
		"note": "Spray more weed killer"
	}, {
		"user": "user1",
		"field": "24616575",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616583",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616605",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616584",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616612",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616611",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616304",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616580",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616579",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616606",
		"note": "Dry soil on Tuesday"
	}, {
		"user": "user1",
		"field": "24616582",
		"note": "Too much fertilizer last month"
	}, {
		"user": "user1",
		"field": "24616574",
		"note": "Too much fertilizer last month"
	}, {
		"user": "user1",
		"field": "24616581",
		"note": "Too much fertilizer last month"
	}]
}`;

var json2 = `{
	"activities": [{
		"user": "user1",
		"field": "24616313",
		"activity": "Watered crops on Tuesday"
	}, {
		"user": "user1",
		"field": "24616312",
		"activity": "Planted seeds on February 12th"
	}, {
		"user": "user1",
		"field": "24616304",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616311",
		"activity": "Sent soil in for testing in January"
	}, {
		"user": "user1",
		"field": "24616312",
		"activity": "Contacted ConAgra regarding seed subsidies"
	}, {
		"user": "user1",
		"field": "24616311",
		"activity": "Plowed half of the east side on Wednesday"
	}, {
		"user": "user1",
		"field": "24616583",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616605",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616584",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616612",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616611",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616304",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616580",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616312",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616579",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616606",
		"activity": "Sprayed Round-up in a 50% diluted solution"
	}, {
		"user": "user1",
		"field": "24616574",
		"activity": "Sent soil in for testing in January"
	}, {
		"user": "user1",
		"field": "24616582",
		"activity": "Sent soil in for testing in January"
	}, {
		"user": "user1",
		"field": "24616607",
		"activity": "Sent soil in for testing in January"
	}, {
		"user": "user1",
		"field": "24616575",
		"activity": "Sent soil in for testing in January"
	}]
}`;
var obj = $.parseJSON(json);
var obj2 = $.parseJSON(json2);
var Map;
var markers = [];

$(document).ready(function() {
    listFields();
    getUsername('#username');
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
      $.each(d.fields, function(i, e){
        loadNotes("#notes" + i, parseNotes(obj, d.fields[i].id));
        loadActivities("#activities" + i, parseActivites(obj2, d.fields[i].id));
      });
    },
    error: function(error) {
      console.log('error: ');
      console.log(error);
    }
  });
}

function markFields(d){
  var error = new Array();
  $.each(d.fields, function(index, element){
    var coords = new Array(element.boundary.coordinates.length);
    $.each(coords, function(ind, el){
      coords[ind] = [];
      $.each(element.boundary.coordinates[ind][0], function(inde, elemen){
        coords[ind].push({lat: parseFloat(elemen[1]), lng: parseFloat(elemen[0])});
      });
    });
    newMarker(Map, element.centroid.coordinates[1], element.centroid.coordinates[0], element.name, element.id);
    $.each(coords, function(ind, el){
      console.log(el);
        var polygon = new google.maps.Polygon({
          map: Map,
          paths: el,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
    });
  });
  var errorMessage;
    if (error.length > 0){
      if (error.length > 1){
        errorMessage = 'Error drawing borders for fields ';
        $.each(error, function(i, e){
          console.log(e);
          if (i = error.length){
            errorMessage += e;
          } else {
            errorMessage += (e + ', ');
          }
        });
      } else {
        errorMessage = 'Error drawing border for field ' + error[0].name;
      }
      alert(errorMessage);
    }
}

function newMarker(map, lat, long, title, id){
  var infowindow = new google.maps.InfoWindow({
      content: title
  });
  var newMarker = new google.maps.Marker({
    position: {lat: lat, lng: long},
    map: map,
    title: title
  });
  google.maps.event.addListener(newMarker, 'click', function() {
      infowindow.open(map,newMarker);
    });
    newMarker.set("id", id);
    markers.push(newMarker);
}

function getUsername(element){
  $.ajax({
    url: 'https://api.climate.com/api/oidc/userinfo',
    xhrFields: {
      withCredentials: true,
    },
    dataType: 'json',
    //Authorization: '', //How to get userid/email address from current user?
    success: function(d) {
      $(element).text('Welcome back, ' + d.given_name + '!');
      console.log(d);
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
      <div class="field" fieldid="` + element.id + `" id="field` + index + `">
        <p class="fieldTitle">` + element.name + `</p>
        <div class="fieldDetail" id="field` + index + `Detail" visible="false" style="display: none">
          <p class="fieldText">Current Weather: <i class="weatherIcon" id="weatherIcon_` + element.id + `"></p>
          <p class="fieldText">Area: ` + element.area.q + element.area.u + `</p>
          <p class="fieldText"><img class="fieldicon" src="css/img/addNoteIcon.png">Notes: </p>
          <div class="fieldNotes" id="notes` + index + `"></div>
          <p class="fieldText"><img class="fieldIcon" src="css/img/plantIcon.png">Activities: </p>
          <div class="fieldActivities" id="activities` + index + `"></div>
        </div>
      </div>`);
  });
}

function loadClicks(d){
  $(".field").each(function(index){
    $(this).click(function(){
      var fieldid = $(this).attr('fieldid');
      Map.panTo({lat: d.fields[index].centroid.coordinates[1], lng: d.fields[index].centroid.coordinates[0]});
      if ($(this).children(".fieldDetail").attr('visible') == 'true'){
        $(this).animate({'min-height':'60px'});
        $(this).children(".fieldDetail").fadeOut();
        $(this).children(".fieldDetail").attr('visible', 'false');
      } else {
        $.each(markers, function(i, e){
          console.log(e.get("id"));
          console.log($(this).attr('fieldid'));
          if (e.get("id") == fieldid){
            e.setAnimation(google.maps.Animation.BOUNCE);
            console.log('bounce');
            setTimeout(function(){
              e.setAnimation(null);
            }, 3000);
          } else {
            e.setAnimation(null);
          }
        });
        $(this).children(".fieldDetail").attr('visible', 'true');
        $(this).animate({'min-height':'300px'});
        $(this).children(".fieldDetail").fadeIn();
      }
      $(this).siblings(".field").children(".fieldDetail").each(function(index, element){
        if ($(element).attr('visible') == 'true'){
          $(element).fadeOut('easeOutBounce');
          $(element).attr('visible', 'false');
          $(element).parent().animate({'min-height':'60px'});
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
function parseNotes(obj, id){
  var myNotes = [];
  $.each(obj.notes, function(i, e){
    if (obj.notes[i].field == id){
      myNotes.push(obj.notes[i].note);
    }
  });
  return myNotes;
}

function loadNotes(div, notes){
  var html = '<ul>';
  var temp;
  $.each(notes, function(i, e){
    html = html + ("<li>" + notes[i] + "</li>");
  });
  html = html + "</ul>";
  $(div).html(html);
}

function parseActivites(obj, id){
  var myActivities = [];
  $.each(obj.activities, function(i, e){
    if (obj.activities[i].field == id){
      myActivities.push(obj.activities[i].activity);
    }
  });
  console.log(myActivities);
  return myActivities;
}

function loadActivities(div, activities){
  var html = '<ul>';
  var temp;
  console.log(activities);
  $.each(activities, function(i, e){
    html = html + ("<li>" + activities[i] + "</li>");
  });
  html = html + "</ul>";
  console.log(html);
  $(div).html(html);
}
