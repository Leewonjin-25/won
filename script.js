// 본인의 API 인증키를 입력하세요.
const SERVICE_KEY = '844263b18fcd9deb425afdc7c2e94ecd261979d7b78ac7d4efc3621b9da183f6'; 
const API_URL = `https://api.odcloud.kr/api/15081953/v1/uddi:b3633094-1a29-43c2-a877-6c84c7811202?page=1&perPage=2000&serviceKey=${SERVICE_KEY}`;

let bridgeData = [];

async function init() {
    const loading = document.getElementById('loading');
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        bridgeData = json.data;

        loading.style.display = 'none';
        setupFilters();
        // 처음에 데이터 일부 보여주기
        renderTable(bridgeData.slice(0, 50));
    } catch (err) {
        loading.innerText = "데이터 로드 실패 (키 설정을 확인하세요)";
        loading.style.color = "red";
    }
}

function setupFilters() {
    const sidos = [...new Set(bridgeData.map(b => b['시도명']))].filter(Boolean).sort();
    const roads = [...new Set(bridgeData.map(b => b['노선명']))].filter(Boolean).sort();
    const structs = [...new Set(bridgeData.map(b => b['상부구조형식']))].filter(Boolean).sort();

    fillSelect('sidoSelect', sidos);
    fillSelect('roadSelect', roads);
    fillSelect('structSelect', structs);
}

function fillSelect(id, items) {
    const el = document.getElementById(id);
    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        el.appendChild(opt);
    });
}

function renderTable(data) {
    const body = document.getElementById('resultBody');
    const count = document.getElementById('resultCount');
    body.innerHTML = '';
    count.innerHTML = `검색 결과: <span class="count-text">${data.length}</span> 건`;

    data.forEach(item => {
        const row = `<tr>
            <td><strong>${item['시설물명']}</strong></td>
            <td>${item['시도명']}</td>
            <td>${item['노선명']}</td>
            <td>${item['상부구조형식']}</td>
        </tr>`;
        body.innerHTML += row;
    });
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const sido = document.getElementById('sidoSelect').value;
    const road = document.getElementById('roadSelect').value;
    const struct = document.getElementById('structSelect').value;

    const filtered = bridgeData.filter(b => {
        return (!sido || b['시도명'] === sido) &&
               (!road || b['노선명'] === road) &&
               (!struct || b['상부구조형식'] === struct);
    });
    renderTable(filtered);
});

init();
