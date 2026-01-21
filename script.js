let allData = [];
let filteredData = [];
let map;
let currentIndex = 0;
const PAGE_SIZE = 10;

// 1. 데이터 로드 및 초기 설정
// 주의: CSV 파일명이 저장소에 올린 이름과 대소문자/공백까지 완벽히 일치해야 합니다.
const csvFileName = "한국문화정보원_전국 배리어프리 문화예술관광지_20221125.csv";

Papa.parse(csvFileName, {
    download: true,
    header: true,
    complete: function(results) {
        // 데이터 필터링: 시설명과 좌표가 있는 것만 추출
        allData = results.data.filter(d => d.시설명 && d.위도 && d.경도);
        
        if (allData.length > 0) {
            console.log("데이터 로드 성공:", allData.length, "건");
            initFilters(); // 데이터가 로드된 '직후'에 필터를 만듭니다.
            initMap(37.5665, 126.9780); // 초기 지도 서울 설정
        } else {
            console.error("데이터는 불러왔으나 유효한 항목이 없습니다. CSV 컬럼명을 확인하세요.");
        }
    },
    error: function(err) {
        console.error("CSV 파일 로드 중 오류 발생:", err);
    }
});

// 2. 필터 세팅 (시/도 선택 항목 채우기)
function initFilters() {
    const sidoSelect = document.getElementById('sidoSelect');
    
    // 데이터에서 '시도 명칭'만 뽑아 중복 제거 후 정렬
    const sidos = [...new Set(allData.map(d => d['시도 명칭']))].filter(Boolean).sort();
    
    // 기존 옵션 유지(시/도 선택)하고 추가
    sidoSelect.innerHTML = '<option value="">시/도 선택</option>';
    sidos.forEach(sido => {
        const opt = document.createElement('option');
        opt.value = sido;
        opt.textContent = sido;
        sidoSelect.appendChild(opt);
    });

    // 카테고리 등 나머지 필터도 동일한 방식으로 초기화
    initOtherFilters();
}

function initOtherFilters() {
    const cat1Select = document.getElementById('cat1Select');
    const cat1 = [...new Set(allData.map(d => d['카테고리1']))].filter(Boolean).sort();
    cat1Select.innerHTML = '<option value="">대분류</option>';
    cat1.forEach(c => {
        cat1Select.innerHTML += `<option value="${c}">${c}</option>`;
    });
}

// 3. 시/군/구 업데이트
function updateGugun() {
    const sido = document.getElementById('sidoSelect').value;
    const gugunSelect = document.getElementById('gugunSelect');
    gugunSelect.innerHTML = '<option value="">시/군/구 선택</option>';
    
    if (!sido) return;

    const guguns = [...new Set(allData.filter(d => d['시도 명칭'] === sido).map(d => d['시군구 명칭']))].filter(Boolean).sort();
    guguns.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        gugunSelect.appendChild(opt);
    });
}

// 4. 지도 초기화
function initMap(lat, lng) {
    const container = document.getElementById('map');
    map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(lat, lng),
        level: 8
    });
}

// 5. 검색 기능 (조회하기 클릭 시)
function searchPlaces() {
    const sido = document.getElementById('sidoSelect').value;
    const gugun = document.getElementById('gugunSelect').value;
    const c1 = document.getElementById('cat1Select').value;
    const c2 = document.getElementById('cat2Select').value;

    filteredData = allData.filter(d => 
        (!sido || d['시도 명칭'] === sido) &&
        (!gugun || d['시군구 명칭'] === gugun) &&
        (!c1 || d['카테고리1'] === c1) &&
        (!c2 || d['카테고리2'] === c2)
    );

    if (filteredData.length > 0) {
        currentIndex = 0;
        document.getElementById('info-list').innerHTML = ''; 
        moveToLocation(filteredData[0].위도, filteredData[0].경도);
        renderNextPage();
    } else {
        alert("해당 조건의 장소가 없습니다.");
    }
}

// 6. 목록 렌더링 (10개씩 더보기)
function renderNextPage() {
    const listDiv = document.getElementById('info-list');
    const nextData = filteredData.slice(currentIndex, currentIndex + PAGE_SIZE);

    nextData.forEach(d => {
        const item = document.createElement('div');
        item.className = 'place-item';
        item.innerHTML = `<strong>${d.시설명}</strong> <small>(${d['카테고리2']})</small>`;
        item.onclick = () => moveToLocation(d.위도, d.경도);
        listDiv.appendChild(item);
    });

    currentIndex += PAGE_SIZE;
    document.getElementById('load-more-btn').style.display = (currentIndex < filteredData.length) ? 'block' : 'none';
}

function loadMore() { renderNextPage(); }

// 7. 지도 이동
function moveToLocation(lat, lng) {
    const loc = new kakao.maps.LatLng(lat, lng);
    map.panTo(loc);
    map.setLevel(4);
    new kakao.maps.Marker({ position: loc, map: map });
}

function goToPlanner() { alert("계획표 페이지로 이동합니다."); }
const sidoList = [
  "서울특별시","부산광역시","대구광역시","인천광역시","광주광역시",
  "대전광역시","울산광역시","세종특별자치시",
  "경기도","강원특별자치도","충청북도","충청남도",
  "전라북도","전라남도","경상북도","경상남도","제주특별자치도"
];

const gugunData = {
  "서울특별시": ["종로구","중구","용산구","성동구","광진구","동대문구","중랑구","성북구","강북구","도봉구","노원구","은평구","서대문구","마포구","양천구","강서구","구로구","금천구","영등포구","동작구","관악구","서초구","강남구","송파구","강동구"],

  "부산광역시": ["중구","서구","동구","영도구","부산진구","동래구","남구","북구","해운대구","사하구","금정구","강서구","연제구","수영구","사상구","기장군"],

  "대구광역시": ["중구","동구","서구","남구","북구","수성구","달서구","달성군","군위군"],

  "인천광역시": ["중구","동구","미추홀구","연수구","남동구","부평구","계양구","서구","강화군","옹진군"],

  "광주광역시": ["동구","서구","남구","북구","광산구"],

  "대전광역시": ["동구","중구","서구","유성구","대덕구"],

  "울산광역시": ["중구","남구","동구","북구","울주군"],

  "세종특별자치시": ["세종시"],

  "경기도": ["수원시","성남시","의정부시","안양시","부천시","광명시","평택시","동두천시","안산시","고양시","과천시","구리시","남양주시","오산시","시흥시","군포시","의왕시","하남시","용인시","파주시","이천시","안성시","김포시","화성시","광주시","양주시","포천시","여주시","연천군","가평군","양평군"],

  "강원특별자치도": ["춘천시","원주시","강릉시","동해시","태백시","속초시","삼척시","홍천군","횡성군","영월군","평창군","정선군","철원군","화천군","양구군","인제군","고성군","양양군"],

  "충청북도": ["청주시","충주시","제천시","보은군","옥천군","영동군","증평군","진천군","괴산군","음성군","단양군"],

  "충청남도": ["천안시","공주시","보령시","아산시","서산시","논산시","계룡시","당진시","금산군","부여군","서천군","청양군","홍성군","예산군","태안군"],

  "전라북도": ["전주시","군산시","익산시","정읍시","남원시","김제시","완주군","진안군","무주군","장수군","임실군","순창군","고창군","부안군"],

  "전라남도": ["목포시","여수시","순천시","나주시","광양시","담양군","곡성군","구례군","고흥군","보성군","화순군","장흥군","강진군","해남군","영암군","무안군","함평군","영광군","장성군","완도군","진도군","신안군"],

  "경상북도": ["포항시","경주시","김천시","안동시","구미시","영주시","영천시","상주시","문경시","경산시","의성군","청송군","영양군","영덕군","청도군","고령군","성주군","칠곡군","예천군","봉화군","울진군","울릉군"],

  "경상남도": ["창원시","진주시","통영시","사천시","김해시","밀양시","거제시","양산시","의령군","함안군","창녕군","고성군","남해군","하동군","산청군","함양군","거창군","합천군"],

  "제주특별자치도": ["제주시","서귀포시"]
};

// 시/도 채우기
const sidoSelect = document.getElementById("sidoSelect");
sidoList.forEach(sido => {
  const opt = document.createElement("option");
  opt.value = sido;
  opt.textContent = sido;
  sidoSelect.appendChild(opt);
});

// 시/군/구 갱신
function updateGugun() {
  const sido = document.getElementById("sidoSelect").value;
  const gugunSelect = document.getElementById("gugunSelect");
  gugunSelect.innerHTML = `<option value="">시/군/구 선택</option>`;
  if (!gugunData[sido]) return;

  gugunData[sido].forEach(gugun => {
    const opt = document.createElement("option");
    opt.value = gugun;
    opt.textContent = gugun;
    gugunSelect.appendChild(opt);
  });
}
