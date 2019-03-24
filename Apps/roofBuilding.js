// this file loads the geojson files that are created after creating kml from geoserver thne using online convertor
// to convert kml to geojson.

var viewer = new Cesium.Viewer("cesiumContainer", {
  navigationHelpButton: false,
  animation: false,
  timeline: false
});
var insetViewer = new Cesium.Viewer("insetCesiumContainer", {
  navigationHelpButton: false,
  animation: false,
  timeline: false
});

// Make the inset window display in 2D, to show it's different.
//insetViewer.scene.morphTo2D(0);

var initialPosition = Cesium.Cartesian3.fromDegrees(
  -73.897766864199923,
  40.733945631808005,
  101.24
);
var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
  21.27879878293835,
  -21.34390550872461,
  0.0716951918898415
);
var camerView = insetViewer.scene.camera.setView({
  destination: initialPosition,
  orientation: initialOrientation,
  endTransform: Cesium.Matrix4.IDENTITY
});

var array = [];
var count = 0 ;
var promise = Cesium.GeoJsonDataSource.load("point_cloud.geojson", {
  stroke: Cesium.Color.BLACK.withAlpha(1.5),
  markerSize: 10,
  markerColor: Cesium.Color.BLACK
});
promise.then(function(dataSource) {
  insetViewer.dataSources.add(dataSource);
  viewer.dataSources.add(dataSource);

  var entities = dataSource.entities.values;
  array = entities;
  console.log(array);

  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    console.log(entity);
    insetViewer.zoomTo(entities[entities.length-1]);
    viewer.zoomTo(entities[entities.length-1]);

    //Extrude the polygon based on any attribute you desire
    entity.polygon.extrudedHeight = 100000.0;
  }
  if (insetViewer.dataSources.contains(dataSource)) {
    insetViewer.dataSources.remove(dataSource);
  }
});

viewer.dataSources.add(
  Cesium.GeoJsonDataSource.load("sattawat-myBuildings_polygon.geojson", {
    stroke: Cesium.Color.YELLOW.withAlpha(1.5),
    strokeWidth: 33,
    markerSize: 10,
    markerColor: Cesium.Color.YELLOW
  })
);

function correct() {
  alert("The selected building class saved as correct!");
  console.log(array);

}
function falsee() {
  alert("The selected building class saved as false!");
//TODO: try to get the right positon of an selected enitity,
//and see this for moving entitiy: https://groups.google.com/forum/#!topic/cesium-dev/3OM1_FIChS0
var redCone = viewer.entities.add({
    name : 'Red cone',
    position: Cesium.Cartesian3.fromDegrees( -73.897766917624068, 40.733944901952768, 23.474543),
    cylinder : {
        length : 4.0,
        topRadius : 0.0,
        bottomRadius : 2.0,
        extrudedHeight: 10.0,
        material : Cesium.Color.RED
    }
});

var dragging;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

handler.setInputAction(function(click) {
    var pickedObject = viewer.scene.pick(click.position);
    console.log('pickedObject',pickedObject.id)
    if (Cesium.defined(pickedObject.id) && pickedObject.id._id === "d361c147-151b-49eb-bfe3-4a3f0139df2d") {
      console.log('aaaaaaaaaaaaaaaa')
        dragging = pickedObject;
        viewer.scene.screenSpaceCameraController.enableRotate = false;
    }
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

handler.setInputAction(function() {
    if (Cesium.defined(dragging)) {
        dragging = undefined;
        viewer.scene.screenSpaceCameraController.enableRotate = true;
    }
}, Cesium.ScreenSpaceEventType.LEFT_UP);

handler.setInputAction(function(movement) {
    var position = viewer.camera.pickEllipsoid(movement.endPosition);
    if (!Cesium.defined(position) || !dragging) {
        return;
    }

    var positionCartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);

    west = Cesium.Math.toDegrees(positionCartographic.longitude);
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  viewer.zoomTo(redCone);
}

var scene = viewer.scene;
viewer.selectedEntityChanged.addEventListener(function(entity) {
    // Check if an entity with a point color was selected.
    console.log('sssssssssss',entity)
    if (Cesium.defined(entity) &&
        Cesium.defined(entity.point) &&
        Cesium.defined(entity.point.color)) {

        // Get the current color
        var color = entity.point.color.getValue(viewer.clock.currentTime);

        // Test for blue
        if (Cesium.Color.equals(color, Cesium.Color.STEELBLUE)) {
            // Set to red
            entity.point.color = Cesium.Color.RED;
        }

        // Test for red
        else if (Cesium.Color.equals(color, Cesium.Color.RED)) {
            // Set to red
            entity.point.color = Cesium.Color.STEELBLUE;
        }
    }
});

function next() {
  count += 100;
  console.log(count);
  //TODO (count % 10)
  viewer.zoomTo(array[count]);
  insetViewer.zoomTo(array[count]);
}
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
