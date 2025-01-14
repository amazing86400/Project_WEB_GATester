// 상수 정의
const DEFAULT_EVENT_PARAM_COUNT = 2;
const DEFAULT_USER_PROPERTY_COUNT = 2;
const DEFAULT_ITEM_PARAM_COUNT = 1;
const DEFAULT_PRODUCT_COUNT = 1;

// 전역 변수 정의
let eventParamCounter = DEFAULT_EVENT_PARAM_COUNT;
let userPropertyCounter = DEFAULT_USER_PROPERTY_COUNT;
let itemParamCounter = DEFAULT_ITEM_PARAM_COUNT;
let productCounter = DEFAULT_PRODUCT_COUNT;

let gaData = {
  eventParam: {},
  userProperty: {},
  items: [],
};
let products = {};

// 유틸리티 함수
const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);
const parseValue = (value, isNumber) => (isNumber ? Number(value) : value);

// 변수 초기화 함수
function resetVariables() {
  eventParamCounter = DEFAULT_EVENT_PARAM_COUNT;
  userPropertyCounter = DEFAULT_USER_PROPERTY_COUNT;
  itemParamCounter = DEFAULT_ITEM_PARAM_COUNT;
  productCounter = DEFAULT_PRODUCT_COUNT;

  gaData = {
    eventParam: {},
    userProperty: {},
    items: [],
  };
  products = {};
}

// 데이터 업데이트 함수
function updateDataObject() {
  const dataObject = {};

  // 페이지 제목 및 페이지 주소 설정
  const pageTitle = document.getElementById("pageTitle").value;
  const pageURL = document.getElementById("pageURL").value;
  const titleType = getElement(".titleType").checked;
  const locationType = getElement(".locationType").checked;
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
    const paramType = group.querySelector(".typeToggle").checked;

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

// 매개변수 업데이트 진행 함수
function processCustomParameters(selector, dataObject, targetObject) {
  getElements(selector).forEach((group) => {
    const keyInput = group.querySelector(".dropdown")?.value || group.querySelector(".formInput.formKey")?.value;
    const valueInput = group.querySelector(".formInput.formValue")?.value || getElement("select.ecommerceSelect")?.value;
    const paramType = group.querySelector(".typeToggle")?.checked;

    if (keyInput) {
      const value = parseValue(valueInput, paramType);
      dataObject[keyInput] = value;
      targetObject[keyInput] = value;
    }
  });
}

// 상품 업데이트 진행 함수
function processItems(dataObject) {
  const items = getElements("#items .inputGroup");
  if (items.length === 0) return;

  const productIndex = getElement("#productTabs > div.select").dataset.productIndex;
  products[`id${productIndex}`] = {};

  items.forEach((group) => {
    const key = group.querySelector(".dropdown")?.value || group.querySelector(".formInput.formKey")?.value;
    const value = group.querySelector(".formInput.formValue")?.value;
    const paramType = group.querySelector(".typeToggle")?.checked;

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

// 실시간 업데이트 이벤트 바인딩
function bindRealTimeUpdate() {
  const inputs = getElements("input.formInput, select, input.checkbox");
  inputs.forEach((input) => {
    input.addEventListener("input", updateDataObject);
    input.addEventListener("change", updateDataObject);
  });
}

// 초기화 함수
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
    ".formKey": "event_parameter1",
    ".formValue": "",
    ".typeDropdown": 0,
  });

  // 사용자 속성 초기화
  resetGroup("#userProperty .parameterGroup", {
    ".formKey": "user_property1",
    ".formValue": "",
    ".typeToggle": 0,
  });
}

// 사전 정의된 매개변수 옵션 업데이트
function updatePredefinedOptions(selectedEvent) {
  const dropdowns = getElements("#preParam .dropdown");

  dropdowns.forEach((dropdown) => {
    const existingEventNameOption = dropdown.querySelector('option[value="event_name"]');
    if (existingEventNameOption) {
      existingEventNameOption.remove();
    }

    const parentGroup = dropdown.closest(".inputGroup");
    const inputElement = parentGroup.querySelector(".formValue");
    const typeDropdown = parentGroup.querySelector(".typeToggle");

    // 기존 전자상거래 select 요소가 있으면 제거
    const ecommerceSelect = parentGroup.querySelector(".ecommerceSelect");
    if (ecommerceSelect) {
      ecommerceSelect.remove();
    }

    // 페이지뷰 또는 이벤트일 경우
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

        typeDropdown.before(newInput);
      }
    }

    // 전자상거래일 경우
    if (selectedEvent === "전자상거래") {
      // 사전 정의된 매개변수
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

      typeDropdown.before(newSelect);
    }

    dropdown.selectedIndex = 0;
  });
}

function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return formattedDate;
}

// 거래 데이터 섹션 추가
function addTransactionSection() {
  const userPropertySection = getElement("#userProperty");

  // 이미 거래 데이터 섹션이 있는 경우 중복 추가 방지
  if (getElement("#transaction")) return;

  const transactionSection = document.createElement("hr");
  transactionSection.innerHTML = `
    <div id="transaction" class="section">
      <div class="sessionTitle">거래 매개변수</div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="currency">currency</option>
        </select>
        <input class="formInput formValue" type="text" value="KRW" placeholder="값 입력" />
        <div class="btn btn-rect" id="button-10">
          <input type="checkbox" class="checkbox typeToggle" />
          <div class="knob">
            <span>Str</span>
          </div>
          <div class="btn-bg"></div>
        </div>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="transaction_id">transaction_id</option>
        </select>
        <input class="formInput formValue" type="text" value="${getFormattedDate()}" placeholder="값 입력" />
        <div class="btn btn-rect" id="button-10">
          <input type="checkbox" class="checkbox typeToggle" />
          <div class="knob">
            <span>Str</span>
          </div>
          <div class="btn-bg"></div>
        </div>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="value">value</option>
        </select>
        <input class="formInput formValue" type="text" value="10000" placeholder="값 입력" />
        <div class="btn btn-rect" id="button-10">
          <input type="checkbox" class="checkbox typeToggle" />
          <div class="knob">
            <span>Str</span>
          </div>
          <div class="btn-bg"></div>
        </div>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="tax">tax</option>
        </select>
        <input class="formInput formValue" type="text" value="1000" placeholder="값 입력" />
        <div class="btn btn-rect" id="button-10">
          <input type="checkbox" class="checkbox typeToggle" />
          <div class="knob">
            <span>Str</span>
          </div>
          <div class="btn-bg"></div>
        </div>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="shipping">shipping</option>
        </select>
        <input class="formInput formValue" type="text" value="1000" placeholder="값 입력" />
        <div class="btn btn-rect" id="button-10">
          <input type="checkbox" class="checkbox typeToggle" />
          <div class="knob">
            <span>Str</span>
          </div>
          <div class="btn-bg"></div>
        </div>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="coupon">coupon</option>
        </select>
        <input class="formInput formValue" type="text" value="2000원 할인 쿠폰" placeholder="값 입력" />
        <div class="btn btn-rect" id="button-10">
          <input type="checkbox" class="checkbox typeToggle" />
          <div class="knob">
            <span>Str</span>
          </div>
          <div class="btn-bg"></div>
        </div>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <button class="addInput" onclick="addInput('transaction')">매개변수 추가</button>
    </div>
  `;

  userPropertySection.after(transactionSection);
}

// 거래 데이터 섹션 제거
function removeTransactionSection() {
  const transactionSection = getElement("#transaction");
  if (transactionSection) {
    const hrTag = transactionSection.parentElement;
    transactionSection.remove();
    if (hrTag && hrTag.tagName === "HR") hrTag.remove();
  }
}

// 탭 선택 함수
function selectedProductTab(event) {
  const target = event.target;
  if (target.tagName.toLowerCase() !== "button") {
    const currentTab = target.closest("div.tab");

    const preSelectedTabs = getElements("#productTabs .tab");
    preSelectedTabs.forEach((tab) => tab.classList.remove("select"));

    currentTab.classList.add("select");

    const productIndex = target.closest("div").dataset.productIndex;
    const nextProduct = products["id" + productIndex];
    const productDataDiv = document.getElementById("productData");
    productDataDiv.innerHTML = "";

    for (const [key, value] of Object.entries(nextProduct)) {
      const inputGroup = document.createElement("div");
      inputGroup.classList.add("inputGroup");

      const dataType = isNaN(value) ? "Str" : "Num";

      inputGroup.innerHTML = `
        <select class="dropdown formKey">
          <option value="${key}">${key}</option>
        </select>
        <input class="formInput formValue" type="text" value="${value}" placeholder="값 입력" />
        <div class="btn btn-rect" id="button-10">
          <input type="checkbox" class="checkbox typeToggle" />
          <div class="knob">
            <span>Str</span>
          </div>
          <div class="btn-bg"></div>
        </div>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      `;

      productDataDiv.appendChild(inputGroup);
    }
  }
}

// 상품 탭 추가 함수
function addProductTab() {
  productCounter++;

  // 상품 탭 추가
  const preSelectedTabs = getElements("#productTabs .tab");
  preSelectedTabs.forEach((tab) => tab.classList.remove("select"));

  const tabContainer = getElement("#productTabs");
  const newTab = document.createElement("div");
  newTab.classList.add("tab", "select");
  newTab.dataset.productIndex = productCounter;
  newTab.onclick = function () {
    selectedProductTab(event);
  };
  newTab.innerHTML = `
    <span>상품 ${productCounter}</span>
    <button class="removeTab" onclick="removeProductTab(event)">X</button>
  `;
  tabContainer.insertBefore(newTab, getElement("#addTab"));

  const productDataDiv = document.getElementById("productData");
  productDataDiv.innerHTML = "";

  const inputGroup1 = document.createElement("div");
  inputGroup1.classList.add("inputGroup");

  inputGroup1.innerHTML = `
    <select class="dropdown formKey">
        <option value="item_id">item_id</option>
      </select>
      <input class="formInput formValue" type="text" value="G-1" placeholder="값 입력" />
      <div class="btn btn-rect" id="button-10">
        <input type="checkbox" class="checkbox typeToggle" />
        <div class="knob">
          <span>Str</span>
        </div>
        <div class="btn-bg"></div>
      </div>
      <button class="removeButton" onclick="removeInput(this)">-</button>
  `;

  productDataDiv.appendChild(inputGroup1);

  const inputGroup2 = document.createElement("div");
  inputGroup2.classList.add("inputGroup");

  inputGroup2.innerHTML = `
    <select class="dropdown formKey">
        <option value="item_name">item_name</option>
      </select>
      <input class="formInput formValue" type="text" value="상품1" placeholder="값 입력" />
      <div class="btn btn-rect" id="button-10">
        <input type="checkbox" class="checkbox typeToggle" />
        <div class="knob">
          <span>Str</span>
        </div>
        <div class="btn-bg"></div>
      </div>
      <button class="removeButton" onclick="removeInput(this)">-</button>
  `;

  productDataDiv.appendChild(inputGroup2);

  updateDataObject();
}

// 상품 탭 삭제 함수
function removeProductTab(event) {
  const currentTab = event.target;

  // 다른 탭 선택 (첫 번째 탭으로 이동)
  const previousTab = currentTab.parentElement.previousElementSibling;
  const nextTab = currentTab.parentElement.nextElementSibling;

  // 상품 탭 삭제
  const productIndex = currentTab.parentElement.dataset.productIndex;
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
        <div class="tab select" data-product-index="1" onclick="selectedProductTab(event)">
          <span>상품 1</span>
          <button class="removeTab" onclick="removeProductTab(event)">X</button>
        </div>
        <button id="addTab" onclick="addProductTab()">+</button>
      </div>
      <div id="productData">
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_id">item_id</option>
          </select>
          <input class="formInput formValue" type="text" value="G-1" placeholder="값 입력" />
          <div class="btn btn-rect" id="button-10">
            <input type="checkbox" class="checkbox typeToggle" />
            <div class="knob">
              <span>Str</span>
            </div>
            <div class="btn-bg"></div>
          </div>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_name">item_name</option>
          </select>
          <input class="formInput formValue" type="text" value="상품1" placeholder="값 입력" />
          <div class="btn btn-rect" id="button-10">
            <input type="checkbox" class="checkbox typeToggle" />
            <div class="knob">
              <span>Str</span>
            </div>
            <div class="btn-bg"></div>
          </div>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
      </div>
      <button class="addInput" onclick="addInput('items')">상품 매개변수 추가</button>
      <button class="addInput" onclick="addMultipleInputs('itemParam')">항목 매개변수 추가</button>
      <input id="itemAddCount" type="number" value="1" min="1" max="200" />
    </div>
  `;

  transactionSection.after(itemsSection);
}

// 상품 데이터 섹션 제거
function removeItemSection() {
  const itemSection = getElement("#items");
  if (itemSection) {
    const hrTag = itemSection.parentElement;
    itemSection.remove();
    if (hrTag && hrTag.tagName === "HR") hrTag.remove();
  }
}

// 이벤트 타입 설정 함수
function setSelectedButton(event) {
  const buttons = getElements("#eventType .event");
  buttons.forEach((button) => button.classList.remove("select"));
  const clickedButton = event.target;
  clickedButton.classList.add("select");

  const selectedEvent = clickedButton.innerText;
  updatePredefinedOptions(selectedEvent);

  if (selectedEvent === "전자상거래") {
    addTransactionSection();
    addItemSection();
  } else {
    removeTransactionSection();
    removeItemSection();
  }

  resetParametersToDefault();
  bindRealTimeUpdate();
  updateDataObject();
}

// 새로운 요소 추가 시 업데이트
function addInput(type) {
  if (type === "preParam") {
    const inputCnt = getElements("#preParam > div.inputGroup").length;
    const seletedEvent = getElement(".select").textContent;
    const limitCnt = seletedEvent === "페이지뷰" ? 2 : 3;
    if (inputCnt < limitCnt) {
      const addButton = getElement("#preParam .addInput");

      // 이미 선택된 옵션 추적
      const usedOptions = Array.from(getElements("#preParam .dropdown")).map((dropdown) => dropdown.value);

      // 모든 옵션 목록
      const allOptions = [
        { value: "contents_group", text: "콘텐츠 그룹" },
        { value: "user_id", text: "사용자 ID" },
      ];

      // 사용 가능한 옵션 계산
      const availableOptions = allOptions.filter((option) => !usedOptions.includes(option.value));

      if (availableOptions.length === 0) {
        alert("추가할 수 있는 옵션이 없습니다.");
        return;
      }

      addButton.insertAdjacentHTML(
        "beforebegin",
        `<div class="inputGroup">
          <select class="dropdown">
            ${availableOptions.map((option) => `<option value="${option.value}">${option.text}</option>`).join("")}
          </select>
          <input class="formInput formValue" type="text" placeholder="값 입력"/>
          <div class="btn btn-rect" id="button-10">
            <input type="checkbox" class="checkbox typeToggle" />
            <div class="knob">
              <span>Str</span>
            </div>
            <div class="btn-bg"></div>
          </div>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>`
      );
    } else {
      alert("모든 매개변수가 추가되었습니다.");
    }
  } else if (type === "transaction") {
    const inputCnt = getElements("#transaction > div.inputGroup").length;
    const limitCnt = 6;
    if (inputCnt < limitCnt) {
      const addButton = getElement("#transaction .addInput");

      // 이미 선택된 옵션 추적
      const usedOptions = Array.from(getElements("#transaction .dropdown")).map((dropdown) => dropdown.value);

      // 모든 옵션 목록
      const allOptions = [
        { value: "currency", text: "currency" },
        { value: "transaction_id", text: "transaction_id" },
        { value: "value", text: "value" },
        { value: "tax", text: "tax" },
        { value: "shipping", text: "shipping" },
        { value: "coupon", text: "coupon" },
      ];

      // 사용 가능한 옵션 계산
      const availableOptions = allOptions.filter((option) => !usedOptions.includes(option.value));

      if (availableOptions.length === 0) {
        alert("추가할 수 있는 옵션이 없습니다.");
        return;
      }

      addButton.insertAdjacentHTML(
        "beforebegin",
        `<div class="inputGroup">
          <select class="dropdown">
            ${availableOptions.map((option) => `<option value="${option.value}">${option.text}</option>`).join("")}
          </select>
          <input class="formInput formValue" type="text" placeholder="값 입력"/>
          <div class="btn btn-rect" id="button-10">
            <input type="checkbox" class="checkbox typeToggle" />
            <div class="knob">
              <span>Str</span>
            </div>
            <div class="btn-bg"></div>
          </div>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>`
      );
    } else {
      alert("모든 매개변수가 추가되었습니다.");
    }
  } else if (type === "items") {
    const inputCnt = getElements("#items > div.inputGroup").length;
    const limitCnt = 18;
    if (inputCnt < limitCnt) {
      const addButton = getElement("#productData");

      // 이미 선택된 옵션 추적
      const usedOptions = Array.from(getElements("#items .dropdown")).map((dropdown) => dropdown.value);

      // 모든 옵션 목록
      const allOptions = [
        { value: "item_id", text: "item_id" },
        { value: "item_name", text: "item_name" },
        { value: "index", text: "index" },
        { value: "item_brand", text: "item_brand" },
        { value: "item_category", text: "item_category" },
        { value: "item_category2", text: "item_category2" },
        { value: "item_category3", text: "item_category3" },
        { value: "item_category4", text: "item_category4" },
        { value: "item_category5", text: "item_category5" },
        { value: "price", text: "price" },
        { value: "quantity", text: "quantity" },
        { value: "item_variant", text: "item_variant" },
        { value: "coupon", text: "coupon" },
        { value: "discount", text: "discount" },
        { value: "item_list_id", text: "item_list_id" },
        { value: "item_list_name", text: "item_list_name" },
        { value: "affiliation", text: "affiliation" },
        { value: "location_id", text: "location_id" },
      ];

      // 사용 가능한 옵션 계산
      const availableOptions = allOptions.filter((option) => !usedOptions.includes(option.value));

      if (availableOptions.length === 0) {
        alert("추가할 수 있는 옵션이 없습니다.");
        return;
      }

      addButton.insertAdjacentHTML(
        "beforeend",
        `<div class="inputGroup">
          <select class="dropdown formKey">
            ${availableOptions.map((option) => `<option value="${option.value}">${option.text}</option>`).join("")}
          </select>
          <input class="formInput formValue" type="text" placeholder="값 입력"/>
          <div class="btn btn-rect" id="button-10">
            <input type="checkbox" class="checkbox typeToggle" />
            <div class="knob">
              <span>Str</span>
            </div>
            <div class="btn-bg"></div>
          </div>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>`
      );
    } else {
      alert("모든 매개변수가 추가되었습니다.");
    }
  }

  bindRealTimeUpdate();
  updateDataObject();
}

function addMultipleInputs(type) {
  let addCountInput;
  let addButton;
  if (type === "eventParam") {
    addButton = getElement("#eventParam .addInput");
    addCountInput = document.getElementById("eventAddCount");
  } else if (type === "userProperty") {
    addButton = getElement("#userProperty .addInput");
    addCountInput = document.getElementById("userAddCount");
  } else if (type === "itemParam") {
    addButton = getElement("#productData");
    addCountInput = document.getElementById("itemAddCount");
  }
  const count = parseInt(addCountInput.value, 10);

  for (let i = 0; i < count; i++) {
    if (type === "eventParam") {
      addButton.insertAdjacentHTML(
        "beforebegin",
        `<div class="parameterGroup">
          <input class="formInput formKey" type="text" value="event_parameter${eventParamCounter}" />
          <input class="formInput formValue" type="text" placeholder="값 입력" />
          <div class="btn btn-rect" id="button-10">
            <input type="checkbox" class="checkbox typeToggle" />
            <div class="knob">
              <span>Str</span>
            </div>
            <div class="btn-bg"></div>
          </div>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>`
      );
      eventParamCounter++;
    } else if (type === "userProperty") {
      addButton.insertAdjacentHTML(
        "beforebegin",
        `<div class="parameterGroup">
          <input class="formInput formKey" type="text" value="user_property${userPropertyCounter}" />
          <input class="formInput formValue" type="text" placeholder="값 입력" />
          <div class="btn btn-rect" id="button-10">
            <input type="checkbox" class="checkbox typeToggle" />
            <div class="knob">
              <span>Str</span>
            </div>
            <div class="btn-bg"></div>
          </div>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>`
      );
      userPropertyCounter++;
    } else if (type === "itemParam") {
      addButton.insertAdjacentHTML(
        "beforeend",
        `<div class="inputGroup">
          <input class="formInput formKey" type="text" value="item_parameter${itemParamCounter}" />
          <input class="formInput formValue" type="text" placeholder="값 입력" />
          <div class="btn btn-rect" id="button-10">
            <input type="checkbox" class="checkbox typeToggle" />
            <div class="knob">
              <span>Str</span>
            </div>
            <div class="btn-bg"></div>
          </div>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>`
      );
      itemParamCounter++;
    }
  }

  bindRealTimeUpdate();
  updateDataObject();
}

// 삭제 함수
function removeInput(button) {
  const parent = button.closest(".inputGroup, .parameterGroup");
  if (parent) {
    parent.remove();
    updateDataObject(); // 삭제 후 데이터 업데이트
  }
}

// 매핑 함수
function keyMapping(key) {
  const keyMap = {
    event_name: "click_event",
    currency: "KRW",
    transaction_id: getFormattedDate(),
    value: 10000,
    tax: 1000,
    shipping: 1000,
    coupon: "2000원 할인 쿠폰",
    item_id: "G-1",
    item_name: "상품1",
    index: "1",
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

  return keyMap[key] || "테스트 입니다";
}

// 초기값 설정 함수
function setInitValue() {
  getElements(".formValue").forEach((formValue) => {
    const key = formValue.parentElement.querySelector(".dropdown")?.value;
    if (!formValue.value) {
      formValue.value = keyMapping(key);
    }
  });

  // to-do: 전자상거래 초기값 설정 추가
  // if () {
  // }
  updateDataObject();
}

// 초기화 실행
document.addEventListener("DOMContentLoaded", () => {
  const buttons = getElements("#eventType .event");
  buttons[0].classList.add("select");

  buttons.forEach((button) => {
    button.addEventListener("click", setSelectedButton);
  });

  updatePredefinedOptions("페이지뷰");
  bindRealTimeUpdate();
  updateDataObject(); // 초기 데이터 업데이트
});
