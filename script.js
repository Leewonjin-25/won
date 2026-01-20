// [주의] 본인의 API 인증키를 아래에 입력하세요.
const SERVICE_KEY = '844263b18fcd9deb425afdc7c2e94ecd261979d7b78ac7d4efc3621b9da183f6'; 
const API_URL = `https://api.odcloud.kr/api/15081953/v1/uddi:b3633094-1a29-43c2-a877-6c84c7811202?page=1&perPage=2000&serviceKey=${SERVICE_KEY}`;

let bridgeData = [];

// DOM 요소 선택
const sidoSelect = document.getElementById('sidoSelect');
const roadSelect = document.getElementById('roadSelect');
const structSelect = document.getElementById('structSelect');
const searchBtn = document.getElementById('searchBtn');
const resultBody = document.getElementById('resultBody');
const loadingMsg = document.getElementById('loading');
const countText = document.getElementById('resultCount');

// 1. API 데이터 호출
async function init() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API 연결 실패');
        
        const json = await response.json();
        bridgeData = json.data;

        loadingMsg.style.display = 'none';
        setupFilters();
    } catch (err) {
        loadingMsg.innerText = "데이터를 불러오지 못했습니다. 인증키를 확인하세요.";
        loadingMsg.style.color = "red";
    }
}

// 2. 필터 옵션 생성
function setupFilters() {
    const sidos = [...new Set(bridgeData.map(b => b['시도명']))].filter(Boolean).sort();
    const roads = [...new Set(bridgeData.map(b => b['노선명']))].filter(Boolean).sort();
    const structs = [...new Set(bridgeData.map(b => b['상부구조형식']))].filter(Boolean).sort();

    addOptions(sidoSelect, sidos);
    addOptions(roadSelect, roads);
    addOptions(structSelect, structs);
}

function addOptions(target, items) {
    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        target.appendChild(opt);
    });
}

// 3. 검색 필터링 함수
function performSearch() {
    const sVal = sidoSelect.value;
    const rVal = roadSelect.value;
    const stVal = structSelect.value;

    const filtered = bridgeData.filter(item => {
        return (!sVal || item['시도명'] === sVal) &&
               (!rVal || item['노선명'] === rVal) &&
               (!stVal || item['상부구조형식'] === stVal);
    });

    renderTable(filtered);
}

// 4. 테이블 출력
function renderTable(data) {
    resultBody.innerHTML = '';
    countText.innerText = `총 ${data.length}개의 교량이 검색되었습니다.`;

    if (data.length === 0) {
        resultBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">검색 결과가 없습니다.</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item['시설물명']}</td>
            <td>${item['시도명']}</td>
            <td>${item['노선명']}</td>
            <td>${item['상부구조형식']}</td>
        `;
        resultBody.appendChild(row);
    });
}

// 이벤트 연결
searchBtn.addEventListener('click', performSearch);

// 실행
init();
