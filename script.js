let allData = [];      // 전체 데이터
let filteredData = []; // 검색 조건에 맞는 데이터
let map;               // 카카오 맵 객체
let currentIndex = 0;  // 현재 보여주는 목록 인덱스
const PAGE_SIZE = 10;  // 한 번에 보여줄 개수

// 1. 데이터 로드 (CSV 파일명이 실제와 일치해야 합니다)
Papa.parse("한국문화정보원_전국 배리어프리 문화예술관광지_20221125.csv", {
    download: true,
    header: true,
    complete: function(results) {
        // 위도, 경도가 있는 데이터만 유효 데이터로 취급
        allData = results.data.filter(d => d.위도 && d.경도 && d.시설명);
        console.log("데이터 로드 완료:", allData.length);
        initFilters(); // 필터 초기화
        initMap(37.5665, 126.9780); // 초기 지도 서울 중심으로 설정
    },
    error: function(err) {
        console.error("CSV 로드 실패:", err);
        alert("데이터 파일을 찾을 수 없습니다. 파일명을 확인해주세요.");
    }
});

// 2. 필터 초기화 (데이터 기반으로 셀렉트 박스 채우기)
function initFilters() {
    const sidos = [...new Set(allData.map(d => d['시도 명칭']))].filter(Boolean).sort();
    fillSelect('sidoSelect', sidos);
    
    const cat1 = [...new Set(allData.map(d => d['카테고리1']))].filter(Boolean).sort();
    fillSelect('cat1Select', cat1);
    
    const cat2 = [...new Set(allData.map(d => d['카테고리2']))].filter(Boolean).sort();
    fillSelect('cat2Select', cat2);
}

function fillSelect(id, list) {
    const sel = document.getElementById(id);
    list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        sel.appendChild(opt);
    });
}

// 3. 시/군/구 업데이트 (시/도 선택 시 호출)
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
    const options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 8
    };
    map = new kakao.maps.Map(container, options);
}

// 5. 검색 및 결과 출력
function searchPlaces() {
    const sido = document.getElementById('sidoSelect').value;
    const gugun = document.getElementById('gugunSelect').value;
    const c1 = document.getElementById('cat1Select').value;
    const c2 = document.getElementById('cat2Select').value;

    // 필터링 로직
    filteredData = allData.filter(d => 
        (!sido || d['시도 명칭'] === sido) &&
        (!gugun || d['시군구 명칭'] === gugun) &&
        (!c1 || d['카테고리1'] === c1) &&
        (!c2 || d['카테고리2'] === c2)
    );

    if (filteredData.length > 0) {
        currentIndex = 0;
        document.getElementById('info-list').innerHTML = ''; // 이전 결과 삭제
        
        // 검색 결과의 첫 번째 장소로 지도 이동 및 확대
        const first = filteredData[0];
        moveToLocation(first.위도, first.경도);
        
        renderNextPage(); // 목록 출력
    } else {
        alert("해당 조건의 장소가 없습니다.");
    }
}

// 6. 목록 렌더링 (10개씩 더보기 포함)
function renderNextPage() {
    const listDiv = document.getElementById('info-list');
    const nextData = filteredData.slice(currentIndex, currentIndex + PAGE_SIZE);

    nextData.forEach(d => {
        const item = document.createElement('div');
        item.className = 'place-item';
        // HTML 구조에 맞춰 시설명 출력 및 클릭 이벤트 부여
        item.innerHTML = `<strong>${d.시설명}</strong> <small style="color:#888;">(${d['카테고리2']})</small>`;
        item.onclick = () => moveToLocation(d.위도, d.경도);
        listDiv.appendChild(item);
    });

    currentIndex += PAGE_SIZE;

    // 더보기 버튼 제어
    const moreBtn = document.getElementById('load-more-btn');
    if (currentIndex < filteredData.length) {
        moreBtn.style.display = 'block';
    } else {
        moreBtn.style.display = 'none';
    }
}

function loadMore() {
    renderNextPage();
}

// 7. 지도 이동 함수
function moveToLocation(lat, lng) {
    const loc = new kakao.maps.LatLng(lat, lng);
    map.panTo(loc);
    map.setLevel(4); // 클릭 시 상세히 보이도록 레벨 조정

    // 마커 표시
    new kakao.maps.Marker({
        position: loc,
        map: map
    });
}

// 계획표 이동 (함수명 맞춰주기)
function goToPlanner() {
    alert("나만의 여행 계획표 페이지로 이동합니다.");
}
