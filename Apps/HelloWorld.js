var viewer = new Cesium.Viewer('cesiumContainer', {
    navigationHelpButton: false, animation: false, timeline: false,
});
var insetViewer = new Cesium.Viewer('insetCesiumContainer', {
  navigationHelpButton: false, animation: false, timeline: false,
  geocoder: false, baseLayerPicker: false, sceneModePicker: false
});

// Make the inset window display in 2D, to show it's different.
insetViewer.scene.morphTo2D(0);

  var initialPosition = Cesium.Cartesian3.fromDegrees(  -73.897766864199923, 40.733945631808005, 101.24);
  var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(21.27879878293835, -21.34390550872461, 0.0716951918898415);
  var camerView = viewer.scene.camera.setView({
     destination: initialPosition,
     orientation: initialOrientation,
     endTransform: Cesium.Matrix4.IDENTITY
  });
  var camerView = insetViewer.scene.camera.setView({
     destination: initialPosition,
     orientation: initialOrientation,
     endTransform: Cesium.Matrix4.IDENTITY
  });

  var promise = Cesium.GeoJsonDataSource.load('sattawat-myBuildings_fefe.geojson', {
    stroke: Cesium.Color.BLACK.withAlpha(0.5),
    fill: Cesium.Color.GREY,
    strokeWidth: 3,
    markerSymbol: '*'


   });
       promise.then(function(dataSource) {
       viewer.dataSources.add(dataSource);
       var entities = dataSource.entities.values;
       for (var i = 0; i < entities.length; i++) {
          var entity = entities[i];
          console.log(entity)
          //Extrude the polygon based on any attribute you desire
          entity.polygon.extrudedHeight = 100000.0;

      }

      });
