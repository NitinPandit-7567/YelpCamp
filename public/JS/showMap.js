// mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vub2JpMjEyIiwiYSI6ImNsb253MXU5cDJzbTQyaXA5Y3FlazVvbjgifQ.29_B36Bh2Yvj4i49WyVj0w'
mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});


const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3>`
            )
    )
    .addTo(map)
