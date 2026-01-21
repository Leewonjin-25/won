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
