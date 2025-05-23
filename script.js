function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 24.805268, lng: 121.036159 } // 預設中心點
    });

    var locations = [
        {
            id: 'park1',
            title: '兒11親子公園(音符公園)',
            subLocations: [
                { lat: 24.80141248522343, lng: 121.04249438188499, title: '' }
            ]
        },
        {
            id: 'park2',
            title: '魔王城堡公園(公7)',
            subLocations: [
                { lat: 24.806052978554614, lng: 121.03166560185085, title: '' },
            ]
        },
        {
            id: 'park3',
            title: ' 冒險小丘遊戲場(兒6)',
            subLocations: [
                { lat: 24.806466777904394, lng: 121.03280724232837, title: '' },
            ]
        },
        {
            id: 'park4',
            title: '水圳森林公園',
            subLocations: [
                { lat: 24.81053209954604, lng: 121.03551760062275, title: '' }
            ]
        },
        {
            id: 'park5',
            title: '繩索公園',
            subLocations: [
                { lat: 24.815883843145343, lng: 121.0300713392515, title: '' }
            ]
        },
        {
            id: 'park6',
            title: '藤蔓公園(公2)',
            subLocations: [
                { lat: 24.810835124568744, lng: 121.02987661596615, title: '' }
            ]
        },
        {
            id: 'park7',
            title: ' 魔豆歷險公園(兒4)',
            subLocations: [
                { lat: 24.810491272192344, lng: 121.02481258527911, title: '' }
            ]
        },
        {
            id: 'park8',
            title: '興隆公園(公24)',
            subLocations: [
                { lat: 24.818396937821863, lng: 121.013081269403, title: '' }
            ]
        },
        {
            id: 'park9',
            title: '文化兒童公園(兒10)',
            subLocations: [
                { lat: 24.83015527355929, lng: 121.013419177348, title: '' }
            ]
        },
        {
            id: 'park10',
            title: '豆子鋪公園',
            subLocations: [
                { lat: 24.837791096810744, lng: 121.0150461808408, title: '' }
            ]
        },
        {
            id: 'park11',
            title: '竹仁公園',
            subLocations: [
                { lat: 24.836649370771877, lng: 121.01571300063392, title: '' }
            ]
        },
        {
            id: 'park12',
            title: 'AI智慧公園',
            subLocations: [
                { lat: 24.832225460319567, lng: 121.0219967239152, title: '' }
            ]
        },
        {
            id: 'park13',
            title: '縣福園公園',
            subLocations: [
                { lat: 24.825293242918445, lng: 121.01523167734584, title: '' }
            ]
        },
        {
            id: 'park14',
            title: '福興公園',
            subLocations: [
                { lat: 24.82353890668419, lng: 121.01001223925466, title: '' }
            ]
        },
        {
            id: 'park15',
            title: '公29公園',
            subLocations: [
                { lat: 24.827258471353936, lng: 121.00082416994287, title: '' }
            ]
        },
        {
            id: 'park16',
            title: '新崙公園',
            subLocations: [
                { lat: 24.83429675052449, lng: 121.00014673872326, title: '' }
            ]
        },
        {
            id: 'park17',
            title: '兒八公園',
            subLocations: [
                { lat: 24.861316214519018, lng: 121.00202566793979, title: '' }
            ]
        },

        

    ];

    var markers = {};
    var infoWindows = {};
    var openInfoWindows = [];

    locations.forEach(location => {
        markers[location.id] = [];
        infoWindows[location.id] = [];
    
        location.subLocations.forEach(subLocation => {
          const marker = new google.maps.Marker({
            position: subLocation,
            map: map,
            title: location.title,
            visible: true
          });
    
          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="info-window-link" data-park="${location.id}" style="cursor:pointer; color:blue; text-decoration:underline;">
                        ${location.title}
                      </div>`
          });
    
          marker.addListener('click', () => {
            closeAllInfoWindows();
            infoWindow.open(map, marker);
            openInfoWindows.push(infoWindow);
            updateInfoContainer(location.id);
          });
    
          markers[location.id].push(marker);
          infoWindows[location.id].push(infoWindow);
        });
      });
    
      // 初始顯示所有地標，但不開 InfoWindow
      let allBounds = new google.maps.LatLngBounds();
      for (let key in markers) {
        markers[key].forEach(marker => {
          marker.setVisible(true);
          allBounds.extend(marker.getPosition());
        });
      }
      map.fitBounds(allBounds);
    
      // 點 sidebar or infoWindow 名稱觸發（共用 .park-item 與 .info-window-link）
      document.addEventListener('click', function (e) {
        if (e.target.classList.contains('park-item') || e.target.classList.contains('info-window-link')) {
          e.preventDefault();
          const parkId = e.target.dataset.park;
          showMarkers(parkId);
          updateInfoContainer(parkId);
        }
      });
    
      function showMarkers(locationId) {
        closeAllInfoWindows();
    
        // 隱藏所有 marker
        for (let key in markers) {
          markers[key].forEach(marker => marker.setVisible(false));
        }
    
        const bounds = new google.maps.LatLngBounds();
        markers[locationId].forEach((marker, index) => {
          marker.setVisible(true);
          infoWindows[locationId][index].open(map, marker);
          openInfoWindows.push(infoWindows[locationId][index]);
          bounds.extend(marker.getPosition());
        });
    
        map.fitBounds(bounds);
        google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
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

    if (locationId === 'park1') {
        content = `
        <h1>音符公園(兒11)</h1>
        <p>302新竹縣竹北市隘口三街239號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：✅</li>
                <li>尿布台：✅ </li>
                <li>衛生紙：✅</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:3~12 歲</li>
                <li>地墊材質：鬆填式鋪面: 礫石</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格：❌</li>
                <li>無障礙坡道：✅</li>
                <li>公園垃圾桶：❌</li>
                <li>家長等候區：❌</li>
                <li>便利資源: 7-11</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <p>女廁和無障礙廁所都有尿布台</p>
        </details>
        
        `;
    }
    else if (locationId === 'park2') {
        content = `
        <h1>魔王城堡公園(公7)</h1>
        <p>302新竹縣竹北市隘口三街239號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：❌</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:6~12 歲</li>
                <li>地墊材質：鬆填式鋪面: 礫石 </li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：❌</li>
                <li>路邊停車格：✅</li>
                <li>無障礙坡道：✅</li>
                <li>公園垃圾桶：❌</li>
                <li>家長等候區：✅</li>
                <li>便利資源: 全家</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <p></p>
        </details>
      `;
    }
    else if (locationId === 'park3') {
        content = `
        <h1>冒險小丘遊戲場(兒6)</h1>
        <p>302新竹縣竹北市六家五路二段51號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：❌</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:3~12 歲</li>
                <li>地墊材質:人工草皮</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格：✅</li>
                <li>無障礙坡道：✅</li>
                <li>公園垃圾桶：❌</li>
                <li>家長等候區：✅</li>
                <li>便利資源: 7-11</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>有流動廁所~</li>
                <li>路邊停車格不多</li>
            </ul>
        </details>
        `;

    }
    else if (locationId === 'park4') {
        content = `
        <h1>水圳森林公園</h1>
        <p>302新竹縣竹北市復興二路</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：✅</li>
                <li>固定嬰兒座椅：✅</li>
                <li>尿布台：✅ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：✅</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:❌</li>
                <li>地墊材質:❌</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格：✅</li>
                <li>無障礙坡道：✅</li>
                <li>公園垃圾桶：✅ </li>
                <li>家長等候區：✅</li>
                <li>便利資源:7-11/全家/萊爾富</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>在女廁有看到尿布台~~</li>
            </ul>
        </details>
        `;
    
    }
    else if (locationId === 'park5') {
        content = `
        <h1>繩索公園</h1>
        <p>302新竹縣竹北市嘉豐三街32號302號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：✅ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：✅</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:6~12歲</li>
                <li>地墊材質:鬆填式鋪面: 礫石 </li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ❌</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 7-11/全家</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>獨自帶小孩來玩，男廁有尿布台超棒的～～</li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park6') {
        content = `
        <h1>藤蔓公園(公2)</h1>
        <p>302新竹縣竹北市文興路一段286號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：❌</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:6~12歲</li>
                <li>地墊材質:單體鋪面: 單片式橡膠地墊
                                      鬆填式舖面: 木片
                                      其他: 人工草皮</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ❌</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 7-11/全家</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>路邊停車格沒有特別多</li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park7') {
        content = `
        <h1> 魔豆歷險公園(兒4)</h1>
        <p>302新竹縣竹北市六家七路8號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：❌</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:2~12歲</li>
                <li>地墊材質:單體鋪面: 澆注式橡膠地墊 鬆填式舖面: 砂/礫石</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：❌</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ❌</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 7-11</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>路邊停車格數量中等></li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park8') {
        content = `
        <h1> 興隆公園(公24)</h1>
        <p>302新竹縣竹北市嘉德街</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：✅</li>
                <li>固定嬰兒座椅：✅</li>
                <li>尿布台：✅ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:2~12歲</li>
                <li>地墊材質:單體鋪面: 澆注式橡膠地墊 鬆填式舖面: 砂/礫石</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ✅</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 7-11</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>路邊停車格數量中等></li>
                <li>女廁及親子廁所皆有尿布台</li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park9') {
        content = `
        <h1>文化兒童公園(兒10)</h1>
        <p>302新竹縣竹北市</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：✅</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:6~12歲</li>
                <li>地墊材質:單體鋪面: 澆注式橡膠地墊</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ❌</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： ❌</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li></li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park10') {
        content = `
        <h1> 豆子鋪公園</h1>
        <p>302新竹縣竹北市三民路149號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：✅</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:全年齡適用</li>
                <li>地墊材質:單體鋪面: 單片式橡膠地墊</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ❌</li>
                <li>公園垃圾桶： ❌</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 7-11/全家/萊爾富</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>公園內較多年長者</li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park11') {
        content = `
        <h1>竹仁公園</h1>
        <p>302新竹縣竹北市文化街</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:❌</li>
                <li>地墊材質:❌</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格： ❌</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ❌</li>
                <li>家長等候區： ✅</li>
                <li>便利資源：  7-11/全家/萊爾富</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>沒有遊樂設施但有操場</li>
                <li>有專用停車場，車位蠻多</li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park12') {
        content = `
        <h1>AI智慧公園</h1>
        <p>302新竹縣竹北市智慧二路1號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：✅</li>
                <li>固定嬰兒座椅：✅</li>
                <li>尿布台：✅ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:全年齡適用</li>
                <li>地墊材質:單體鋪面: 澆注式橡膠地墊
                            鬆填式鋪面: 砂 
                            鬆填式鋪面: 礫石 </li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：❌</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ❌</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： ❌</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>有廁所但有點遠ㄟ!! 要到智慧二路路邊QQ</li>
                <li>尿布台在親子廁所(但圖示竟然是母女？!)</li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park13') {
        content = `
        <h1>縣福園公園</h1>
        <p>302新竹縣竹北市光明六路</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：✅</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:❌</li>
                <li>地墊材質:❌</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：❌</li>
                <li>路邊停車格： ❌</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ❌</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 7-11</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li></li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park14') {
        content = `
        <h1>福興公園</h1>
        <p>302新竹縣竹北市</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:3~12歲</li>
                <li>地墊材質:鬆填式鋪面: 礫石</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：❌</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ❌</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 7-11</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li></li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park15') {
        content = `
        <h1>公29公園</h1>
        <p>302新竹縣竹北市博愛南路</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:6~12歲</li>
                <li>地墊材質:鬆填式鋪面: 礫石</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ✅</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 7-11/全家</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>滑板區12歲以下需家長陪同</li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park16') {
        content = `
        <h1>新崙公園</h1>
        <p>302新竹縣竹北市</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：✅</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:2~12歲</li>
                <li>地墊材質:單體鋪面: 單片式橡膠地墊
                            單體鋪面: 澆注式橡膠地墊
                            鬆填式舖面: 木片 </li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格： ✅</li>
                <li>無障礙坡道： ✅</li>
                <li>公園垃圾桶： ✅</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 7-11/萊爾富</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li>廁所外有飲水機</li>
            </ul>
        </details>
        `;
    }
    else if (locationId === 'park17') {
        content = `
        <h1>兒八公園</h1>
        <p>302新竹縣竹北市新民街96號</p>
        <details class="info-box toilet">
            <summary>🚻 廁所與育兒設施</summary>
            <ul>
                <li>廁所：✅</li>
                <li>兒童迷你馬桶：❌</li>
                <li>固定嬰兒座椅：❌</li>
                <li>尿布台：❌ </li>
                <li>衛生紙：❌</li>
                <li>衛生紙販賣機：❌</li>
                <li>哺乳室：❌</li>
            </ul>
        </details>
        <details class="info-box playground">
            <summary>🎠 遊樂設施</summary>
            <ul>
                <li>適用年齡:2~12歲</li>
                <li>地墊材質:單體鋪面: 單片式橡膠地墊</li>
            </ul>
        </details>
        <details class="info-box nearby">
        <summary>🅿️ 周邊設施</summary>
            <ul>
                <li>停車場：✅</li>
                <li>路邊停車格： ❌</li>
                <li>無障礙坡道： ❌</li>
                <li>公園垃圾桶： ✅</li>
                <li>家長等候區： ✅</li>
                <li>便利資源： 全家/萊爾富</li>
            </ul>
        </details>

        <details class="info-box review">
        <summary>📢 家長評論</summary>
            <ul>
                <li></li>
            </ul>
        </details>
        `;
    }
    infoContainer.innerHTML = content;
}
/*關閉sidebar */
document.addEventListener("DOMContentLoaded", function () {
    var sidebarCollapse = new bootstrap.Collapse(document.getElementById('park-nav'), {
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


