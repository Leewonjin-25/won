// script.js
let allData = [];
let filteredData = [];

// CSV 불러오기
Papa.parse("data.csv", {
  download: true,
  header: true,
  complete: function (results) {
    allData = results.data.filter(d => d.name && d.lat && d.lng);
    initFilters();
  }
});

function initFilters() {
  const sidoSet = new Set();
  const cat1Set = new Set();
  allData.forEach(d => {
    sidoSet.add(d.sido);
    cat1Set.add(d.cat1);
  });
  const sidoSelect = document.getElementById("sidoSelect");
  const cat1Select = document.getElementById("cat1Select");
  sidoSet.forEach(s => sidoSelect.innerHTML += `<option value="${s}">${s}</option>`);
  cat1Set.forEach(c => cat1Select.innerHTML += `<option value="${c}">${c}</option>`);
}

function updateGugun() {
  const sido = document.getElementById("sidoSelect").value;
  const gugunSelect = document.getElementById("gugunSelect");
  gugunSelect.innerHTML = '<option value="">시/군/구 선택</option>';
  const gugunSet = new Set();
  allData.filter(d => d.sido === sido).forEach(d => gugunSet.add(d.gugun));
  gugunSet.forEach(g => gugunSelect.innerHTML += `<option value="${g}">${g}</option>`);
}

// 대분류(카테고리1) → 중분류(카테고리2)
document.getElementById("cat1Select").addEventListener("change", function () {
  const cat1 = this.value;
  const cat2Select = document.getElementById("cat2Select");
  cat2Select.innerHTML = '<option value="">중분류(카테고리2)</option>';
  const cat2Set = new Set();
  allData.filter(d => d.cat1 === cat1).forEach(d => cat2Set.add(d.cat2));
  cat2Set.forEach(c => cat2Select.innerHTML += `<option value="${c}">${c}</option>`);
});

function searchPlaces() {
  const sido = document.getElementById("sidoSelect").value;
  const gugun = document.getElementById("gugunSelect").value;
  const cat1 = document.getElementById("cat1Select").value;
  const cat2 = document.getElementById("cat2Select").value;

  filteredData = allData.filter(d =>
    (!sido || d.sido === sido) &&
    (!gugun || d.gugun === gugun) &&
    (!cat1 || d.cat1 === cat1) &&
    (!cat2 || d.cat2 === cat2)
  );

  showList();
}

function showList() {
  const listDiv = document.getElementById("info-list");
  if (filteredData.length === 0) {
    listDiv.innerHTML = "<p>조건에 맞는 관광지가 없습니다.</p>";
    return;
  }
  let html = "<ul>";
  filteredData.forEach(d => {
    html += `<li>${d.name}</li>`;
  });
  html += "</ul>";
  listDiv.innerHTML = html;
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
let allData=[];
let filteredData=[];
let currentIndex=0;
const PAGE_SIZE=10;
let map;

Papa.parse("한국문화정보원_전국 배리어프리 문화예술관광지_20221125.csv",{
 download:true,
 header:true,
 complete:(res)=>{
   allData = res.data.filter(d=>d.시설명 && d.위도 && d.경도);
   initSido();
   initCategory();
   initMap(37.5665,126.9780);
 }
});

// 시/도
function initSido(){
 const sidos=[...new Set(allData.map(d=>d["시도 명칭"]).filter(Boolean))].sort();
 const el=document.getElementById("sidoSelect");
 sidos.forEach(s=>{
   const o=document.createElement("option");
   o.value=s;o.textContent=s;el.appendChild(o);
 });
}

// 시/군/구
function updateGugun(){
 const sido=document.getElementById("sidoSelect").value;
 const el=document.getElementById("gugunSelect");
 el.innerHTML=`<option value="">시/군/구 선택</option>`;
 if(!sido)return;
 const list=[...new Set(allData.filter(d=>d["시도 명칭"]===sido).map(d=>d["시군구 명칭"]).filter(Boolean))].sort();
 list.forEach(g=>{
   const o=document.createElement("option");
   o.value=g;o.textContent=g;el.appendChild(o);
 });
}

// 카테고리
function initCategory(){
 const cat1=[...new Set(allData.map(d=>d["카테고리1"]).filter(Boolean))].sort();
 const cat1El=document.getElementById("cat1Select");
 const cat2El=document.getElementById("cat2Select");

 cat1.forEach(c=>{
   const o=document.createElement("option");
   o.value=c;o.textContent=c;cat1El.appendChild(o);
 });

 cat1El.onchange=function(){
   const v=this.value;
   cat2El.innerHTML=`<option value="">중분류</option>`;
   const list=[...new Set(allData.filter(d=>d["카테고리1"]===v).map(d=>d["카테고리2"]).filter(Boolean))].sort();
   list.forEach(c=>{
     const o=document.createElement("option");
     o.value=c;o.textContent=c;cat2El.appendChild(o);
   });
 };
}

// 지도
function initMap(lat,lng){
 map=new kakao.maps.Map(document.getElementById("map"),{
   center:new kakao.maps.LatLng(lat,lng),level:8
 });
}
function moveTo(lat,lng){
 const pos=new kakao.maps.LatLng(parseFloat(lat),parseFloat(lng));
 map.panTo(pos);
 new kakao.maps.Marker({map,position:pos});
}

// 검색
function searchPlaces(){
 const sido=sidoSelect.value;
 const gugun=gugunSelect.value;
 const c1=cat1Select.value;
 const c2=cat2Select.value;

 filteredData = allData.filter(d=>
   (!sido||d["시도 명칭"]===sido) &&
   (!gugun||d["시군구 명칭"]===gugun) &&
   (!c1||d["카테고리1"]===c1) &&
   (!c2||d["카테고리2"]===c2)
 );

 currentIndex=0;
 infoList.innerHTML="";
 if(filteredData.length===0){
   infoList.innerHTML=`<p class="guide">결과가 없습니다.</p>`;
   loadMoreBtn.style.display="none";
   return;
 }
 renderNext();
 moveTo(filteredData[0].위도,filteredData[0].경도);
}

// 목록
function renderNext(){
 const part=filteredData.slice(currentIndex,currentIndex+PAGE_SIZE);
 part.forEach(d=>{
   const div=document.createElement("div");
   div.className="place-item";
   div.innerHTML=`<b>${d.시설명}</b> <small>${d["카테고리2"]||""}</small>`;
   div.onclick=()=>moveTo(d.위도,d.경도);
   infoList.appendChild(div);
 });
 currentIndex+=PAGE_SIZE;
 loadMoreBtn.style.display = currentIndex<filteredData.length ? "block":"none";
}
function loadMore(){renderNext();}
