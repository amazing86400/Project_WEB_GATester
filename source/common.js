//#region 전역 변수 모음
// 매개변수 카운터 초기값
const DEFAULT_CUSTOM_DIMENSION_COUNT = 2;
const DEFAULT_USER_PROPERTY_COUNT = 2;
const DEFAULT_CUSTOM_METRIC_COUNT = 1;
const DEFAULT_ITEM_PARAM_COUNT = 1;
const DEFAULT_PRODUCT_COUNT = 1;

// 매개변수 카운터 Object 활용
let globalCounters = {
  customDimensionCounter: DEFAULT_CUSTOM_DIMENSION_COUNT,
  customMetricCounter: DEFAULT_CUSTOM_METRIC_COUNT,
  userPropertyCounter: DEFAULT_USER_PROPERTY_COUNT,
  itemParamCounter: DEFAULT_ITEM_PARAM_COUNT,
  productCounter: DEFAULT_PRODUCT_COUNT,
};

// GA4 전송 데이터
let gaData = {
  eventParam: {},
  userProperty: {},
  items: [],
};

// 사용자 설정 상품 데이터
let products = {};

// 거래 데이터 초기값
const transactionObject = {
  currency: "KRW",
  transaction_id: getFormattedDate(),
  value: 10000,
  tax: 1000,
  shipping: 1000,
  coupon: "거래 할인 쿠폰",
};

// 상품 데이터 초기값
const itemObject = {
  item_id: "G-",
  item_name: "상품",
  index: 0,
  item_brand: "골든플래닛",
  item_category: "상품 카테고리1",
  item_category2: "상품 카테고리2",
  item_category3: "상품 카테고리3",
  item_category4: "상품 카테고리4",
  item_category5: "상품 카테고리5",
  price: 10000,
  quantity: 1,
  item_variant: "상품 옵션",
  coupon: "상품 쿠폰",
  discount: 2000,
  item_list_id: "L-1",
  item_list_name: "상품 목록1",
  affiliation: "거래처",
  location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
};

// 유틸리티 함수
const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);
const parseValue = (value, isNumber) => (isNumber ? Number(value) : value);
//#endregion

//#region 초기화 함수 모음
// 변수 초기화 함수
function resetVariables() {
  globalCounters = {
    customDimensionCounter: DEFAULT_CUSTOM_DIMENSION_COUNT,
    customMetricCounter: DEFAULT_CUSTOM_METRIC_COUNT,
    userPropertyCounter: DEFAULT_USER_PROPERTY_COUNT,
    itemParamCounter: DEFAULT_ITEM_PARAM_COUNT,
    productCounter: DEFAULT_PRODUCT_COUNT,
  };

  gaData = {
    eventParam: {},
    userProperty: {},
    items: [],
  };
  products = {};
}

// 사용자 설정 매개변수 초기화 함수
function resetParametersToDefault() {
  resetVariables();

  // 리셋 함수 정의
  const resetGroup = (selector, keyDefaults) => {
    const groups = getElements(selector);
    groups.forEach((group, index) => {
      if (index > 0) group.remove();
    });

    const firstGroup = getElement(selector);
    if (firstGroup) {
      Object.entries(keyDefaults).forEach(([key, defaultValue]) => {
        const element = firstGroup.querySelector(key);
        if (element) {
          if (element.tagName === "INPUT") {
            element.value = defaultValue;
          } else if (element.tagName === "SELECT") {
            element.selectedIndex = defaultValue;
          }
        }
      });
    }
  };

  // 사전 정의 초기화
  resetGroup("#preParam .inputGroup", {
    ".formValue": "",
    ".ecommerceSelect": 0,
    ".dropdown": 0,
    ".typeDropdown": 0,
  });

  // 이벤트 매개변수 초기화
  resetGroup("#eventParam .parameterGroup", {
    ".formKey": "ep_param1",
    ".formValue": "",
    ".typeDropdown": 0,
  });

  // 사용자 속성 초기화
  resetGroup("#userProperty .parameterGroup", {
    ".formKey": "up_param1",
    ".formValue": "",
    ".typeToggle": 0,
  });
}
//#endregion

//#region cid 설정 함수 모음
// cid 설정하기 함수
function setClientId() {
  const userPropertyInput = getElement("#userGroup .formInput.formValue");
  const clientIdValue = getClientId();
  userPropertyInput.value = clientIdValue;
}

// cid 가져오기 함수
function getClientId() {
  const clientId = document.cookie.split("_ga=GA1.1.")[1]?.split(";")[0];
  if (!clientId) return "새로고침을 하시면 cid가 설정됩니다.";

  return clientId;
}
//#endregion

//#region 업데이트 함수 모음
// dataObject 업데이트 함수
function updateDataObject() {
  const dataObject = {};
  gaData.eventParam = {};
  gaData.userProperty = {};

  // 페이지 제목 및 페이지 주소 설정
  const pageTitle = document.getElementById("pageTitle").value;
  const pageURL = document.getElementById("pageURL").value;
  const titleType = getElement(".titleType").classList.contains("active");
  const locationType = getElement(".locationType").classList.contains("active");
  dataObject.page_title = parseValue(pageTitle, titleType);
  dataObject.page_location = parseValue(pageURL, locationType);

  gaData.eventParam.page_title = dataObject.page_title;
  gaData.eventParam.page_location = dataObject.page_location;

  // 사전 정의, 이벤트, 사용자 속성 업데이트
  processCustomParameters("#preParam .inputGroup", dataObject, gaData.eventParam);
  processCustomParameters("#eventParam .parameterGroup", dataObject, gaData.eventParam);
  processCustomParameters("#userProperty .parameterGroup", dataObject, gaData.userProperty);

  // 거래 데이터 업데이트
  const transactions = getElements("#transaction .inputGroup");
  transactions.forEach((group) => {
    const dropdown = group.querySelector(".dropdown").value;
    const input = group.querySelector(".formInput").value;
    const paramType = group.querySelector(".toggleButton").classList.contains("active");

    if (dropdown) {
      const value = parseValue(input, paramType);
      dataObject[dropdown] = value;
      gaData.eventParam[dropdown] = value;
    }
  });

  // 상품 데이터 업데이트
  processItems(dataObject);

  // 데이터 표시 영역 업데이트
  const viewDataDiv = getElement("#viewData");
  if (viewDataDiv) viewDataDiv.innerHTML = `<pre>${syntaxHighlight(dataObject)}</pre>`;
}

// updateDataObject() 매개변수 업데이트 진행 함수
function processCustomParameters(selector, dataObject, targetObject) {
  getElements(selector).forEach((group) => {
    const keyInput = group.querySelector(".dropdown")?.value || group.querySelector(".formInput.formKey")?.value;
    const valueInput = group.querySelector(".formInput.formValue")?.value || group.querySelector("select.ecommerceSelect")?.value;
    const paramType = group.querySelector(".typeToggle")?.classList.contains("active");

    if (keyInput) {
      const value = parseValue(valueInput, paramType) == undefined ? "" : parseValue(valueInput, paramType);
      dataObject[keyInput] = value;
      targetObject[keyInput] = value;
    }
  });
}

// updateDataObject() 상품 업데이트 진행 함수
function processItems(dataObject) {
  const items = getElements("#items .inputGroup");
  if (items.length === 0) return;

  const productIndex = getElement("#productTabs > div.select").dataset.productIndex;
  products[`id${productIndex}`] = {};

  items.forEach((group) => {
    const key = group.querySelector(".dropdown")?.value || group.querySelector(".formInput.formKey")?.value;
    const value = group.querySelector(".formInput.formValue")?.value;
    const paramType = group.querySelector(".typeToggle")?.classList.contains("active");

    if (key) {
      products[`id${productIndex}`][key] = parseValue(value, paramType);
    }
  });

  dataObject.items = Object.values(products);
  gaData.items = dataObject.items;
}

// viewData 정규식 정의 함수
function syntaxHighlight(json) {
  return JSON.stringify(json, null, 2).replace(
    /("(.*?)")(?=:)|("(.*?)")|(\b\d+\.?\d*)|(\btrue\b|\bfalse\b)|(\bnull\b)|([{}\[\]])/g,
    (match, keyWithColon, key, stringValue, string, number, boolean, nullValue, bracket) => {
      if (keyWithColon) return `<span class="key">${keyWithColon}</span>`;
      if (stringValue) return `<span class="string">${stringValue}</span>`;
      if (number) return `<span class="number">${number}</span>`;
      if (boolean) return `<span class="boolean">${boolean}</span>`;
      if (nullValue) return `<span class="null">${nullValue}</span>`;
      if (bracket) return `<span class="bracket">${bracket}</span>`;
      return match;
    }
  );
}

// 사전 정의된 매개변수 옵션 업데이트
function updatePredefinedOptions(selectedEvent) {
  const dropdowns = getElements("#preParam .dropdown");

  dropdowns.forEach((dropdown) => {
    const parentGroup = dropdown.closest(".inputGroup");

    // 기존 이벤트 이름 요소 있으면 제거
    const existingEventNameOption = dropdown.querySelector('option[value="event_name"]');
    if (existingEventNameOption) {
      existingEventNameOption.remove();
    }
    // 기존 전자상거래 select 요소가 있으면 제거
    const ecommerceSelect = parentGroup.querySelector(".ecommerceSelect");
    if (ecommerceSelect) {
      ecommerceSelect.remove();
    }
    const inputElement = parentGroup.querySelector(".formValue");
    const typeDropdown = parentGroup.querySelector(".dropdown");

    if (selectedEvent === "페이지뷰" || selectedEvent === "이벤트") {
      if (selectedEvent === "이벤트") {
        const eventNameOption = document.createElement("option");
        eventNameOption.value = "event_name";
        eventNameOption.text = "이벤트 이름";
        dropdown.insertBefore(eventNameOption, dropdown.firstChild);
      }

      if (!inputElement) {
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.classList.add("formInput", "formValue");
        newInput.placeholder = "값 입력";

        typeDropdown.after(newInput);
      }
    } else if (selectedEvent === "전자상거래") {
      const eventNameOption = document.createElement("option");
      eventNameOption.value = "event_name";
      eventNameOption.text = "이벤트 이름";
      dropdown.insertBefore(eventNameOption, dropdown.firstChild);

      if (inputElement) {
        inputElement.remove();
      }

      const newSelect = document.createElement("select");
      newSelect.classList.add("ecommerceSelect");
      newSelect.innerHTML = `
        <option value="view_promotion">view_promotion</option>
        <option value="select_promotion">select_promotion</option>
        <option value="view_item_list">view_item_list</option>
        <option value="select_item">select_item</option>
        <option value="view_item">view_item</option>
        <option value="add_to_wishlist">add_to_wishlist</option>
        <option value="add_to_cart">add_to_cart</option>
        <option value="view_cart">view_cart</option>
        <option value="remove_from_cart">remove_from_cart</option>
        <option value="begin_checkout">begin_checkout</option>
        <option value="add_payment_info">add_payment_info</option>
        <option value="add_shipping_info">add_shipping_info</option>
        <option value="purchase">purchase</option>
        <option value="refund">refund</option>
      `;

      typeDropdown.after(newSelect);
    }

    dropdown.selectedIndex = 0;
  });
}

// 실시간 업데이트 이벤트 바인딩
function bindRealTimeUpdate() {
  const inputs = getElements("input.formInput, select, div.toggleButton");
  inputs.forEach((input) => {
    input.addEventListener("input", updateDataObject);
    input.addEventListener("change", updateDataObject);
    input.addEventListener("click", updateDataObject);
  });
}
//#endregion

//#region 매개변수 추가 및 각종 기능
// 이벤트 타입 설정 함수
function setSelectedButton(event) {
  const buttons = getElements("#eventType .eventDiv");
  buttons.forEach((button) => button.classList.remove("select"));
  const clickedButton = event.target.closest(".eventDiv");
  clickedButton.classList.add("select");

  const selectedEvent = clickedButton.innerText;
  updatePredefinedOptions(selectedEvent);

  if (selectedEvent === "전자상거래") {
    addTransactionSection();
    addItemSection();
  } else {
    removeSection();
  }

  resetParametersToDefault();
  setClientId();
  updateDataObject();
  bindRealTimeUpdate();
}

// 사전 정의 및 전자상거래 추가 함수
function addInput(type) {
  const typeConfig = {
    preParam: {
      selector: "#preParam > div.inputGroup",
      addButton: "#preParam .addInput",
      limitCnt: () => (getElement(".select").textContent === "페이지뷰" ? 3 : 4),
      allOptions: [
        { value: "client_id", text: "Client ID", type: "Str" },
        { value: "user_id", text: "User ID", type: "Str" },
        { value: "contents_group", text: "콘텐츠 그룹", type: "Str" },
      ],
    },
    transaction: {
      selector: "#transaction div.inputGroup",
      addButton: "#transactionData",
      limitCnt: () => 6,
      allOptions: [
        { value: "currency", text: "currency", type: "Str" },
        { value: "transaction_id", text: "transaction_id", type: "Str" },
        { value: "value", text: "value", type: "Num" },
        { value: "tax", text: "tax", type: "Num" },
        { value: "shipping", text: "shipping", type: "Num" },
        { value: "coupon", text: "coupon", type: "Str" },
      ],
    },
    items: {
      selector: "#items div.inputGroup",
      addButton: "#productData",
      limitCnt: () => 18,
      allOptions: [
        { value: "item_id", text: "item_id", type: "Str" },
        { value: "item_name", text: "item_name", type: "Str" },
        { value: "index", text: "index", type: "Num" },
        { value: "item_brand", text: "item_brand", type: "Str" },
        { value: "item_category", text: "item_category", type: "Str" },
        { value: "item_category2", text: "item_category2", type: "Str" },
        { value: "item_category3", text: "item_category3", type: "Str" },
        { value: "item_category4", text: "item_category4", type: "Str" },
        { value: "item_category5", text: "item_category5", type: "Str" },
        { value: "price", text: "price", type: "Num" },
        { value: "quantity", text: "quantity", type: "Num" },
        { value: "item_variant", text: "item_variant", type: "Str" },
        { value: "coupon", text: "coupon", type: "Str" },
        { value: "discount", text: "discount", type: "Num" },
        { value: "item_list_id", text: "item_list_id", type: "Str" },
        { value: "item_list_name", text: "item_list_name", type: "Str" },
        { value: "affiliation", text: "affiliation", type: "Str" },
        { value: "location_id", text: "location_id", type: "Str" },
      ],
    },
  };

  const config = typeConfig[type];
  if (!config) return;

  const inputCnt = getElements(config.selector).length;
  const limitCnt = config.limitCnt();

  if (inputCnt < limitCnt) {
    const addButton = getElement(config.addButton);

    // 이미 선택된 옵션 추적
    const usedOptions = Array.from(getElements(`${config.selector} .dropdown`)).map((dropdown) => dropdown.value);

    // 사용 가능한 옵션 계산
    const availableOptions = config.allOptions.filter((option) => !usedOptions.includes(option.value));

    if (availableOptions.length === 0) {
      alert("추가할 수 있는 옵션이 없습니다.");
      return;
    }

    addButton.insertAdjacentHTML(
      type === "preParam" ? "beforebegin" : "beforeend",
      `<div class="inputGroup">
        <select class="dropdown">
          ${availableOptions.map((option) => `<option value="${option.value}">${option.text}</option>`).join("")}
        </select>
        <input class="formInput formValue" type="text" placeholder="값 입력"/>
        <div class="toggleButton typeToggle ${availableOptions[0].type === "Num" ? "active" : ""}" onclick="toggleBtn(this)">${availableOptions[0].type === "Num" ? "Num" : "Str"}</div>
        <button class="removeButton" onclick="removeInput(this)">x</button>
      </div>`
    );
  } else {
    alert("모든 매개변수가 추가되었습니다.");
  }

  updateDataObject();
  bindRealTimeUpdate();
}

// 이벤트 매개변수 및 사용자 속성 추가 함수
function addMultipleInputs(selector, count, name) {
  const addButton = getElement(selector);
  const className = selector === "#productData" ? "inputGroup" : "parameterGroup";
  const addCountInput = document.getElementById(count);
  const parseCount = parseInt(addCountInput.value, 10);
  const counterKey = name === "ep_param" ? "customDimensionCounter" : name === "cm_param" ? "customMetricCounter" : name === "up_param" ? "userPropertyCounter" : "itemParamCounter";

  for (let i = 0; i < parseCount; i++) {
    addButton.insertAdjacentHTML(
      "beforeend",
      `<div class="${className}">
        <input class="formInput formKey" type="text" value="${name + globalCounters[counterKey]}" />
        <input class="formInput formValue" type="text" placeholder="값 입력" />
        <div class="toggleButton typeToggle ${name === "cm_param" ? "active" : undefined}" onclick="toggleBtn(this)">${name === "cm_param" ? "Num" : "Str"}</div>
        <button class="removeButton" onclick="removeInput(this)">x</button>
      </div>`
    );

    globalCounters[counterKey]++;
  }

  updateDataObject();
  bindRealTimeUpdate();
}

// 타입 토글 함수
function toggleBtn(button) {
  button.classList.toggle("active");
  button.textContent = button.classList.contains("active") ? "Num" : "Str";
}

// 삭제 함수
function removeInput(button) {
  const parent = button.closest(".inputGroup, .parameterGroup");
  if (parent) {
    parent.remove();
    updateDataObject();
  }
}

// numInput 숫자 증가 함수
function numPlus(button) {
  const input = button.closest(".controls").querySelector(".numInput");
  if (parseInt(input.value) < 201) {
    input.value = parseInt(input.value) + 1;
  }
}

// numInput 숫자 감소 함수
function numMinus(button) {
  const input = button.closest(".controls").querySelector(".numInput");
  if (parseInt(input.value) > 0) {
    input.value = parseInt(input.value) - 1;
  }
}

// 자동입력 초기값 설정 함수
function setInitValue() {
  getElements(".formValue").forEach((formValue) => {
    const key = formValue.parentElement.querySelector(".dropdown")?.value || formValue.parentElement.querySelector(".formInput.formKey")?.value;
    if (!formValue.value) {
      formValue.value = getDefaultValue(key);
    }
  });

  // 전자상거래 초기값 설정 추가
  if (getElement("#eventType > div.eventDiv.select >.event").textContent === "전자상거래") {
    setEcommerceInit();
  }

  updateDataObject();
  bindRealTimeUpdate();
}

// 기본 값 가져오기
function getDefaultValue(key) {
  const defaultValues = {
    event_name: "click_event",
    client_id: getClientId(),
  };
  if (key?.includes("cm_")) return 10;
  return defaultValues[key] || "테스트 입니다.";
}

// 전자상거래 초기값 설정 함수
function setEcommerceInit() {
  // 거래 데이터 설정
  const transactionDataDiv = document.getElementById("transactionData");
  transactionDataDiv.innerHTML = "";

  Object.entries(transactionObject).forEach(([key, value]) => {
    const inputGroup = createInputGroup(key, value);
    transactionDataDiv.appendChild(inputGroup);
  });

  // 상품 데이터 설정
  products = {};
  for (let i = 1; i <= globalCounters.productCounter; i++) {
    products[`id${i}`] = {};
    Object.entries(itemObject).forEach(([key, value]) => {
      products[`id${i}`][key] = key === "index" ? Number(value) + i : ["item_id", "item_name"].includes(key) ? `${value}${i}` : value;
    });
  }

  // 화면에 현재 상품 비추기
  const currentProductIndex = document.querySelector("#productTabs > .tab.select").dataset.productIndex;
  viewCurrentProduct(currentProductIndex);
}

// 현재 시간 포맷 함수
function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const formattedDate = `T${year}${month}${day}${hours}${minutes}${seconds}`;

  return formattedDate;
}
//#endregion

//#region 전자상거래 기능 모음
// 거래 데이터 섹션 추가
function addTransactionSection() {
  const userPropertySection = getElement("#userProperty");

  // 이미 거래 데이터 섹션이 있는 경우 중복 추가 방지
  if (getElement("#transaction")) return;

  const transactionSection = document.createElement("hr");
  transactionSection.innerHTML = `
    <div id="transaction" class="section">
      <div class="sessionTitle">거래 매개변수</div>
      <div id="transactionData">
        <div class="inputGroup">
          <select class="dropdown">
            <option value="currency">currency</option>
          </select>
          <input class="formInput formValue" type="text" value="KRW" placeholder="값 입력" />
          <div class="toggleButton typeToggle" onclick="toggleBtn(this)">Str</div>
          <button class="removeButton" onclick="removeInput(this)">x</button>
        </div>
      </div>
      <button class="addInput" onclick="addInput('transaction')">매개변수 추가</button>
    </div>
  `;

  userPropertySection.after(transactionSection);
}

// 상품 데이터 섹션 추가
function addItemSection() {
  const transactionSection = getElement("#transaction");

  // 이미 상품 데이터 섹션이 있는 경우 중복 추가 방지
  if (getElement("#items")) return;

  const itemsSection = document.createElement("hr");
  itemsSection.innerHTML = `
    <div id="items" class="section">
      <div class="sessionTitle">상품 매개변수</div>
      <div id="productTabs" class="tabs">
        <div class="tab select" data-product-index="1" onclick="selectProductTab(event)">
          <span>상품 1</span>
          <div class="removeDiv">
            <button class="removeTab" onclick="removeProductTab(event)">x</button>
          </div>
        </div>
        <button id="addTab" onclick="addProductTab()">+</button>
      </div>
      <div id="productData">
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_id">item_id</option>
          </select>
          <input class="formInput formValue" type="text" value="G-1" placeholder="값 입력" />
          <div class="toggleButton typeToggle" onclick="toggleBtn(this)">Str</div>
          <button class="removeButton" onclick="removeInput(this)">x</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_name">item_name</option>
          </select>
          <input class="formInput formValue" type="text" value="상품1" placeholder="값 입력" />
          <div class="toggleButton typeToggle" onclick="toggleBtn(this)">Str</div>
          <button class="removeButton" onclick="removeInput(this)">x</button>
        </div>
      </div>
      <div class="controls">
        <button class="addInput" onclick="addInput('items')">상품 매개변수 추가</button>
        <button class="addInput" onclick="addMultipleInputs('#productData', 'itemAddCount', 'ip_param')">항목 매개변수 추가</button>
        <input id="itemAddCount" class="numInput" type="number" value="1" min="1" max="200" />
        <div>
          <div class="numPlus" onclick="numPlus(this)">+</div>
          <div class="numMinus" onclick="numMinus(this)">-</div>
        </div>
      </div>
    </div>
  `;

  transactionSection.after(itemsSection);
}

// 거래 및 상품 데이터 섹션 제거
function removeSection() {
  ["#transaction", "#items"].forEach((selector) => {
    const section = getElement(selector);
    if (section) {
      const hrTag = section.parentElement;
      section.remove();
      if (hrTag && hrTag.tagName === "HR") hrTag.remove();
    }
  });
}

// 상품 탭 추가 함수
function addProductTab() {
  globalCounters.productCounter++;
  const productCounter = globalCounters.productCounter;

  // 상품 탭 추가
  getElements("#productTabs .tab").forEach((tab) => tab.classList.remove("select"));

  const tabContainer = getElement("#productTabs");
  const newTab = document.createElement("div");
  newTab.classList.add("tab", "select");
  newTab.dataset.productIndex = productCounter;
  newTab.innerHTML = `
    <span>상품 ${productCounter}</span>
    <div class="removeDiv">
      <button class="removeTab" onclick="removeProductTab(event)">x</button>
    </div>
  `;
  newTab.addEventListener("click", (event) => selectProductTab(event));
  tabContainer.insertBefore(newTab, getElement("#addTab"));

  // 상품 데이터 화면 업데이트
  const productDataDiv = document.getElementById("productData");
  productDataDiv.innerHTML = "";

  const inputGroups = [
    { key: "item_id", value: `G-${productCounter}` },
    { key: "item_name", value: `상품${productCounter}` },
  ];

  inputGroups.forEach(({ key, value }) => {
    const inputGroup = createInputGroup(key, value);
    productDataDiv.appendChild(inputGroup);
  });

  updateDataObject();
}

// 상품탭 선택 함수
function selectProductTab(event) {
  const target = event.target;
  if (target.tagName.toLowerCase() !== "button") {
    const currentTab = target.closest("div.tab");

    getElements("#productTabs .tab").forEach((tab) => tab.classList.remove("select"));

    currentTab.classList.add("select");

    const productIndex = target.closest("div").dataset.productIndex;
    viewCurrentProduct(productIndex);

    bindRealTimeUpdate();
  }
}

// 현재 상품 나타내기 함수
function viewCurrentProduct(index) {
  const nextProduct = products[`id${index}`];
  const productDataDiv = getElement("#productData");
  productDataDiv.innerHTML = "";

  Object.entries(nextProduct).forEach(([key, value]) => {
    const inputGroup = createInputGroup(key, value);
    productDataDiv.appendChild(inputGroup);
  });
}

// Input Group 생성 함수
function createInputGroup(key, value) {
  const dataType = isNaN(value) ? "Str" : "Num";
  const inputGroup = document.createElement("div");
  inputGroup.classList.add("inputGroup");

  inputGroup.innerHTML = `
    <select class="dropdown formKey">
      <option value="${key}">${key}</option>
    </select>
    <input class="formInput formValue" type="text" value="${value}" placeholder="값 입력" />
    <div class="toggleButton typeToggle ${dataType === "Num" ? "active" : ""}" onclick="toggleBtn(this)">${dataType === "Num" ? "Num" : "Str"}</div>
    <button class="removeButton" onclick="removeInput(this)">x</button>
  `;

  return inputGroup;
}

// 상품 탭 삭제 함수
function removeProductTab(event) {
  const currentTab = event.target;

  // 다른 탭 선택 (첫 번째 탭으로 이동)
  const previousTab = currentTab.closest(".tab").previousElementSibling;
  // const previousTab = currentTab.parentElement.previousElementSibling;
  const nextTab = currentTab.closest(".tab").nextElementSibling;
  // const nextTab = currentTab.parentElement.nextElementSibling;

  // 상품 탭 삭제
  const productIndex = currentTab.closest(".tab").dataset.productIndex;
  // const productIndex = currentTab.parentElement.dataset.productIndex;
  const tab = getElement(`.tab[data-product-index="${productIndex}"]`);
  if (tab) {
    tab.remove();
    delete products["id" + productIndex];
  }

  const selectedTab = getElement("#productTabs > div.tab.select");
  if (!selectedTab) {
    if (previousTab) {
      previousTab.classList.add("select");
    } else if (nextTab) {
      nextTab.classList.add("select");
    }
  }

  updateDataObject();
}
//#endregion

// 초기화 실행
document.addEventListener("DOMContentLoaded", () => {
  const buttons = getElements("#eventType .eventDiv");
  buttons[0].classList.add("select");

  buttons.forEach((button) => {
    button.addEventListener("click", setSelectedButton);
  });

  setClientId();

  updatePredefinedOptions("페이지뷰");
  updateDataObject();
  bindRealTimeUpdate();
});

function contactUs() {
  const url = document.location.pathname;
  console.log(url);
  if (url.includes("Project_DataInspector")) {
    window.open("https://github.com/amazing86400/Project_WEB_DataInspector");
  } else if (url.includes("Project_WEB_GATester")) {
    window.open("https://github.com/amazing86400/Project_WEB_GATester");
  } else if (url.includes("GTMgenerator")) {
    window.open("https://github.com/amazing86400/Project_WEB_GTMgenerator");
  }
}
