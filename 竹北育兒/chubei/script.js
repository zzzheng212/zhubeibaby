function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 24.805268, lng: 121.036159 } // 預設中心點
    });

    var locations = [
        {
            id: 'restaurant1',
            title: '兒11親子公園(音符公園)',
            subLocations: [
                { lat: 24.80141248522343, lng: 121.04249438188499, title: '' }
            ]
        },
        {
            id: 'restaurant2',
            title: '享鴨',
            subLocations: [
                { lat: 25.08337123472803, lng: 121.29319317322877, title: '桃園同德店' },
                { lat: 25.034071706973933, lng: 121.52701191208229, title: '台北金山南店' },
                { lat: 25.041549986480675, lng: 121.54792562237186, title: '台北忠孝東店' }
            ]
        },
        {
            id: 'restaurant3',
            title: '涮乃葉',
            subLocations: [
                { lat: 25.037115574562485, lng: 121.56812486654995, title: '信義遠百店' },
                { lat: 23.079810705074472, lng: 120.24166082360118, title: '台南遠百成功店' }
            ]
        },
        { id: 'restaurant4', coords: { lat: 25.052124092335085, lng: 121.5479585399683 }, title: '橫浜牛排 微風南京店' },
        { id: 'restaurant5', coords: { lat: 24.96184325386761, lng: 121.22662872740773 }, title: '原燒 中壢元化店' },
        {
            id: 'restaurant6',
            title: '柚子花花青春客家菜',
            subLocations: [
                { lat: 25.023061392372526, lng: 121.2960357287901, title: '桃園店' },
                { lat: 25.005499299074692, lng: 121.20263635838165, title: 'A19環球青埔店' },
                { lat: 24.83061323240136, lng: 121.03172300641192, title: '竹北享平方店' },
                { lat: 25.05835694398406, lng: 121.5202360901603, title: '台北店' }
            ]
        },
        {
            id: 'restaurant7',
            title: '陶板屋',
            subLocations: [
                { lat: 24.964341288060027, lng: 121.22192276249923, title: '中壢中山店' },
                { lat: 24.96997841604051, lng: 121.29906187900747, title: '八德大和店' }
            ]
        },
        {
            id: 'restaurant8',
            title: '王品牛排',
            subLocations: [
                { lat: 25.025806252110055, lng: 121.30318071091851, title: '桃園同德店' },
                { lat: 25.071107801265327, lng: 121.5221557425648, title: '台北中山北店' },
                { lat: 24.83063092889069, lng: 121.01419090702255, title: '新竹光明店' },
                { lat: 22.981603258109068, lng: 120.21101259627386, title: '台南健康店' }

            ]
        },
        { id: 'restaurant9', coords: { lat: 25.041223010234816, lng: 121.1958237148014 }, title: '尬鍋 中壢店' },
    ];

    var markers = {};
    var infoWindows = {};
    var openInfoWindows = [];

    locations.forEach(function (location) {
        if (location.subLocations) {
            markers[location.id] = [];
            infoWindows[location.id] = [];
            location.subLocations.forEach(function (subLocation) {
                var marker = new google.maps.Marker({
                    position: subLocation,
                    map: map,
                    title: location.title + ' ' + subLocation.title,
                    visible: false
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: location.title + ' ' + subLocation.title
                });

                marker.addListener('click', function () {
                    closeAllInfoWindows();
                    infoWindow.open(map, marker);
                    openInfoWindows.push(infoWindow);
                });

                markers[location.id].push(marker);
                infoWindows[location.id].push(infoWindow);
            });
        } else {
            var marker = new google.maps.Marker({
                position: location.coords,
                map: map,
                title: location.title,
                visible: false
            });

            var infoWindow = new google.maps.InfoWindow({
                content: location.title
            });

            marker.addListener('click', function () {
                closeAllInfoWindows();
                infoWindow.open(map, marker);
                openInfoWindows.push(infoWindow);
            });

            markers[location.id] = [marker];
            infoWindows[location.id] = [infoWindow];
        }

        // Listen for clicks on the menu items
        document.getElementById(location.id).addEventListener('click', function () {
            showMarkers(location.id);
            updateInfoContainer(location.id);
        });
    });

    function showMarkers(locationId) {
        closeAllInfoWindows();

        // 隱藏所有標記
        for (var key in markers) {
            markers[key].forEach(function (marker) {
                marker.setVisible(false);
            });
        }

        // 顯示選中地標的標記並打開對應的信息窗口
        var bounds = new google.maps.LatLngBounds();
        markers[locationId].forEach(function (marker, index) {
            marker.setVisible(true);
            infoWindows[locationId][index].open(map, marker);
            openInfoWindows.push(infoWindows[locationId][index]);
            bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
        var listener = google.maps.event.addListenerOnce(map, "bounds_changed", function () {
            if (map.getZoom() > 16) {
                map.setZoom(16);
            }
        });
    }

    function closeAllInfoWindows() {
        while (openInfoWindows.length) {
            openInfoWindows.pop().close();
        }
    }
}


function smoothPanAndZoom(map, destination, zoomLevel) {
    let start = Date.now();
    let duration = 1000; // Duration in milliseconds
    let startLatLng = map.getCenter();
    let endLatLng = destination;
    let deltaLat = (endLatLng.lat() - startLatLng.lat()) / duration;
    let deltaLng = (endLatLng.lng() - startLatLng.lng()) / duration;
    let startZoom = map.getZoom();
    let deltaZoom = (zoomLevel - startZoom) / duration;

    let interval = setInterval(function () {
        let now = Date.now() - start;
        if (now >= duration) {
            map.panTo(endLatLng);
            map.setZoom(zoomLevel);
            clearInterval(interval);
        } else {
            map.panTo({
                lat: startLatLng.lat() + deltaLat * now,
                lng: startLatLng.lng() + deltaLng * now
            });
            map.setZoom(Math.round(startZoom + deltaZoom * now));
        } ``
    },); // Adjust the time interval for smooth animation
}

function updateInfoContainer(locationId) {
    const infoContainer = document.getElementById('info-container');
    let content = '';

    if (locationId === 'restaurant1') {
        content = `
        <h1>兒11親子公園(音符公園)</h1>
        <p>302新竹縣竹北市隘口三街239號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>親子廁所：有</li>
                <li>尿布台：男廁、女廁、無障礙皆有</li>
                <li>兒童用洗手台：無</li>
                <li>固定與兒童座椅：有</li>
                <li>衛生紙提供：有</li>
                <li>哺乳室：無</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:3~12 歲</li>
                <li>地墊材質：防撞地墊</li>
                <li>設施材質：塑膠 / 木製 / 金屬</li>
                <li>防護設計：護網、緩衝設計</li>
                <li>是否有年齡分區：有</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：有</li>
                <li>無障礙坡道：有</li>
                <li>急救設施:AED 等設備</li>
                <li>飲水機：有設置</li>
                <li>垃圾桶分類：有</li>
                <li>便利資源：附近有超商、公車站、便利設施</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <p>育兒便利五星，設施齊全又乾淨！</p>
        </details>
        
        `;
    }
    else if (locationId === 'products6') {
        content = `
        <h1>新視代影音科技</h1>
      `;
    }
    infoContainer.innerHTML = content;
}
/*關閉sidebar */
document.addEventListener("DOMContentLoaded", function () {
    var sidebarCollapse = new bootstrap.Collapse(document.getElementById('restaurant-nav'), {
        toggle: false
    });
    sidebarCollapse.hide();
});

document.addEventListener("DOMContentLoaded", function () {
    var headers = document.querySelectorAll('.menu-item h3');
    headers.forEach(function (header) {
        header.addEventListener('click', function () {
            var content = this.nextElementSibling;
            if (content.style.display === "none" || !content.style.display) {
                content.style.display = "block";
                this.classList.add('open');
            } else {
                content.style.display = "none";
                this.classList.remove('open');
            }
        });
    });

    /*const toggleButton = document.querySelector('.toggle-sidebar-btn');
    const sidebar = document.querySelector('#sidebar');*/
    const main = document.querySelector('#main');

    toggleButton.addEventListener('click', function () {
        /*sidebar.classList.toggle('hidden');*/
        main.classList.toggle('shrink');
    });
});


