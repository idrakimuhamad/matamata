Template.explore_map.rendered = function () {
  var tmpl = this;

  VazcoMaps.init({}, function() {
    tmpl.mapEngine = VazcoMaps.gMaps();
    tmpl.exploreMap = new tmpl.mapEngine({
        div: '#map-canvas',
        lat: 51.10789,
        lng: 17.03854,
        zoom: 6
    });
  });
};