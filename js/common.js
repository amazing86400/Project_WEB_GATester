let eventParamCounter = 2;
let itemParamCounter = 1;
let userPropertyCounter = 2;
let productCounter = 1;
let gaData = {
  eventParam: {},
  userProperty: {},
  items: [],
};
let products = {};

// 데이터 업데이트 함수
function updateDataObject() {
  const dataObject = {};

  // 페이지 제목 및 페이지 주소 설정
  const pageTitle = document.getElementById("pageTitle").value;
  const pageURL = document.getElementById("pageURL").value;
  const titleType = document.querySelector(".titleType").value;
  const locationType = document.querySelector(".locationType").value;
  dataObject.page_title = titleType === "num" ? Number(pageTitle) : pageTitle;
  dataObject.page_location = locationType === "num" ? Number(pageURL) : pageURL;

  gaData.eventParam.page_title = titleType === "num" ? Number(pageTitle) : pageTitle;
  gaData.eventParam.page_location = locationType === "num" ? Number(pageURL) : pageURL;

  // 사전 정의된 매개변수 설정
  const preParams = document.querySelectorAll("#preParam .inputGroup");
  preParams.forEach((group) => {
    const dropdown = group.querySelector(".dropdown").value;
    let input;
    if (group.querySelector(".formInput")) {
      input = group.querySelector(".formInput").value;
    } else {
      input = document.querySelector("select.ecommerceSelect").value;
    }
    const paramType = group.querySelector(".typeDropdown").value;
    if (dropdown) {
      dataObject[dropdown] = paramType === "num" ? Number(input) : input;
      gaData.eventParam[dropdown] = paramType === "num" ? Number(input) : input;
    }
  });

  // 이벤트 매개변수 설정
  const eventParams = document.querySelectorAll("#eventParam .parameterGroup");
  eventParams.forEach((group) => {
    const paramName = group.querySelectorAll(".formInput")[0].value;
    const paramValue = group.querySelectorAll(".formInput")[1].value;
    const paramType = group.querySelector(".typeDropdown").value;

    if (paramName) {
      dataObject[`${paramName}`] = paramType === "num" ? Number(paramValue) : paramValue;
      gaData.eventParam[`${paramName}`] = paramType === "num" ? Number(paramValue) : paramValue;
    }
  });

  // 사용자 속성 설정
  const userProperties = document.querySelectorAll("#userProperty .parameterGroup");
  userProperties.forEach((group) => {
    const propName = group.querySelectorAll(".formInput")[0].value;
    const propValue = group.querySelectorAll(".formInput")[1].value;
    const propType = group.querySelector(".typeDropdown").value;

    if (propName) {
      dataObject[`${propName}`] = propType === "num" ? Number(propValue) : propValue;
      gaData.userProperty[`${propName}`] = propType === "num" ? Number(propValue) : propValue;
    }
  });

  const transactions = document.querySelectorAll("#transaction .inputGroup");
  if (transactions.length > 0) {
    transactions.forEach((group) => {
      const dropdown = group.querySelector(".dropdown").value;
      let input = group.querySelector(".formInput").value;
      const paramType = group.querySelector(".typeDropdown").value;
      if (dropdown) {
        dataObject[dropdown] = paramType === "num" ? Number(input) : input;
        gaData.eventParam[dropdown] = paramType === "num" ? Number(input) : input;
      }
    });
  }

  const items = document.querySelectorAll("#items .inputGroup");
  if (items.length > 0) {
    const productIndex = document.querySelector("#productTabs > div.select").dataset["productIndex"];
    products["id" + productIndex] = {};

    items.forEach((group) => {
      let key;
      if (group.querySelector(".dropdown")) {
        key = group.querySelector(".dropdown").value;
      } else {
        key = group.querySelector(".formInput.formKey").value;
      }
      let value = group.querySelector(".formInput.formValue").value;
      const paramType = group.querySelector(".typeDropdown").value;
      if (key) {
        products["id" + productIndex][key] = paramType === "num" ? Number(value) : value;
      }
    });

    dataObject["items"] = [];
    gaData.items = [];

    for (var idx in products) {
      dataObject["items"].push(products[idx]);
      gaData.items.push(products[idx]);
    }
  }

  // 데이터 표시 영역 업데이트
  const viewDataDiv = document.querySelector("#viewData");
  viewDataDiv.innerHTML = `<pre>${JSON.stringify(dataObject, null, 2)}</pre>`;
}

// 실시간 업데이트 이벤트 바인딩
function bindRealTimeUpdate() {
  const inputs = document.querySelectorAll("input.formInput, select");
  inputs.forEach((input) => {
    input.addEventListener("input", updateDataObject);
    input.addEventListener("change", updateDataObject);
  });
}

// 초기화 함수
function resetParametersToDefault() {
  eventParamCounter = 2;
  userPropertyCounter = 2;
  itemParamCounter = 1;
  productCounter = 1;

  gaData = {
    eventParam: {},
    userProperty: {},
    items: [],
  };

  products = {};

  // 사전 정의된 매개변수 초기화
  const inputGroups = document.querySelectorAll("#preParam .inputGroup");
  inputGroups.forEach((group, index) => {
    if (index > 0) group.remove();
  });

  const firstGroup = document.querySelector("#preParam .inputGroup");
  if (firstGroup) {
    const inputElement = firstGroup.querySelector(".formValue");
    const ecommerceSelect = firstGroup.querySelector(".ecommerceSelect");

    if (inputElement) {
      inputElement.value = "";
    } else if (ecommerceSelect) {
      ecommerceSelect.selectedIndex = 0;
    }

    const dropdown = firstGroup.querySelector(".dropdown");
    if (dropdown) {
      dropdown.selectedIndex = 0;
    }

    const typeDropdown = firstGroup.querySelector(".typeDropdown");
    if (typeDropdown) {
      typeDropdown.selectedIndex = 0;
    }
  }

  // 이벤트 매개변수 초기화
  const eventGroups = document.querySelectorAll("#eventParam .parameterGroup");
  eventGroups.forEach((group, index) => {
    if (index > 0) group.remove();
  });

  const firstEventGroup = document.querySelector("#eventParam .parameterGroup");
  if (firstEventGroup) {
    const keyInput = firstEventGroup.querySelector(".formKey");
    const valueInput = firstEventGroup.querySelector(".formValue");
    const typeDropdown = firstEventGroup.querySelector(".typeDropdown");

    if (keyInput) keyInput.value = "event_parameter1";
    if (valueInput) valueInput.value = "";
    if (typeDropdown) typeDropdown.selectedIndex = 0;
  }

  // 사용자 속성 초기화
  const userGroups = document.querySelectorAll("#userProperty .parameterGroup");
  userGroups.forEach((group, index) => {
    if (index > 0) group.remove();
  });

  const firstUserGroup = document.querySelector("#userProperty .parameterGroup");
  if (firstUserGroup) {
    const keyInput = firstUserGroup.querySelector(".formKey");
    const valueInput = firstUserGroup.querySelector(".formValue");
    const typeDropdown = firstUserGroup.querySelector(".typeDropdown");

    if (keyInput) keyInput.value = "user_property1";
    if (valueInput) valueInput.value = "";
    if (typeDropdown) typeDropdown.selectedIndex = 0;
  }
}

// 사전 정의된 매개변수 옵션 업데이트
function updatePredefinedOptions(selectedEvent) {
  const dropdowns = document.querySelectorAll("#preParam .dropdown");

  dropdowns.forEach((dropdown) => {
    const existingEventNameOption = dropdown.querySelector('option[value="event_name"]');
    if (existingEventNameOption) {
      existingEventNameOption.remove();
    }

    const parentGroup = dropdown.closest(".inputGroup");
    const inputElement = parentGroup.querySelector(".formValue");
    const typeDropdown = parentGroup.querySelector(".typeDropdown");

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
  const userPropertySection = document.querySelector("#userProperty");

  // 이미 거래 데이터 섹션이 있는 경우 중복 추가 방지
  if (document.querySelector("#transaction")) return;

  const transactionSection = document.createElement("hr");
  transactionSection.innerHTML = `
    <div id="transaction" class="section">
      <div class="sessionTitle">거래 매개변수</div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="currency">currency</option>
        </select>
        <input class="formInput formValue" type="text" value="KRW" placeholder="값 입력" />
        <select class="typeDropdown">
          <option value="str">Str</option>
          <option value="num">Num</option>
        </select>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="transaction_id">transaction_id</option>
        </select>
        <input class="formInput formValue" type="text" value="${getFormattedDate()}" placeholder="값 입력" />
        <select class="typeDropdown">
          <option value="str">Str</option>
          <option value="num">Num</option>
        </select>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="value">value</option>
        </select>
        <input class="formInput formValue" type="text" value="10000" placeholder="값 입력" />
        <select class="typeDropdown">
          <option value="str">Str</option>
          <option value="num" selected>Num</option>
        </select>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="tax">tax</option>
        </select>
        <input class="formInput formValue" type="text" value="1000" placeholder="값 입력" />
        <select class="typeDropdown">
          <option value="str">Str</option>
          <option value="num" selected>Num</option>
        </select>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="shipping">shipping</option>
        </select>
        <input class="formInput formValue" type="text" value="1000" placeholder="값 입력" />
        <select class="typeDropdown">
          <option value="str">Str</option>
          <option value="num" selected>Num</option>
        </select>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <div class="inputGroup">
        <select class="dropdown">
          <option value="coupon">coupon</option>
        </select>
        <input class="formInput formValue" type="text" value="2000원 할인 쿠폰" placeholder="값 입력" />
        <select class="typeDropdown">
          <option value="str">Str</option>
          <option value="num">Num</option>
        </select>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>
      <button class="addInput" onclick="addInput('transaction')">매개변수 추가</button>
    </div>
  `;

  userPropertySection.after(transactionSection);
}

// 거래 데이터 섹션 제거
function removeTransactionSection() {
  const transactionSection = document.querySelector("#transaction");
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

    const preSelectedTabs = document.querySelectorAll("#productTabs .tab");
    preSelectedTabs.forEach((tab) => tab.classList.remove("select"));

    currentTab.classList.add("select");
  }
}

// 상품 탭 추가 함수
function addProductTab() {
  productCounter++;

  // 상품 탭 추가
  const preSelectedTabs = document.querySelectorAll("#productTabs .tab");
  preSelectedTabs.forEach((tab) => tab.classList.remove("select"));

  const tabContainer = document.querySelector("#productTabs");
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
  tabContainer.insertBefore(newTab, document.querySelector("#addTab"));

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
  const tab = document.querySelector(`.tab[data-product-index="${productIndex}"]`);
  if (tab) tab.remove();

  const selectedTab = document.querySelector("#productTabs > div.tab.select");
  if (!selectedTab) {
    if (previousTab) {
      previousTab.classList.add("select");
    } else if (nextTab) {
      nextTab.classList.add("select");
    }
  }
}

// 상품 데이터 섹션 추가
function addItemSection() {
  const transactionSection = document.querySelector("#transaction");

  // 이미 상품 데이터 섹션이 있는 경우 중복 추가 방지
  if (document.querySelector("#items")) return;

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
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_name">item_name</option>
          </select>
          <input class="formInput formValue" type="text" value="상품1" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="index">index</option>
          </select>
          <input class="formInput formValue" type="text" value="1" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num" selected>Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_brand">item_brand</option>
          </select>
          <input class="formInput formValue" type="text" value="골든플래닛" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_category">item_category</option>
          </select>
          <input class="formInput formValue" type="text" value="상품 카테고리1" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_category2">item_category2</option>
          </select>
          <input class="formInput formValue" type="text" value="상품 카테고리2" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_category3">item_category3</option>
          </select>
          <input class="formInput formValue" type="text" value="상품 카테고리3" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_category4">item_category4</option>
          </select>
          <input class="formInput formValue" type="text" value="상품 카테고리4" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_category5">item_category5</option>
          </select>
          <input class="formInput formValue" type="text" value="상품 카테고리5" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="price">price</option>
          </select>
          <input class="formInput formValue" type="text" value="10000" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num" selected>Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="quantity">quantity</option>
          </select>
          <input class="formInput formValue" type="text" value="1" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num" selected>Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_variant">item_variant</option>
          </select>
          <input class="formInput formValue" type="text" value="상품 옵션" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="coupon">coupon</option>
          </select>
          <input class="formInput formValue" type="text" value="상품 쿠폰" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="discount">discount</option>
          </select>
          <input class="formInput formValue" type="text" value="2000" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num" selected>Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_list_id">item_list_id</option>
          </select>
          <input class="formInput formValue" type="text" value="L-1" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="item_list_name">item_list_name</option>
          </select>
          <input class="formInput formValue" type="text" value="상품 목록1" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="affiliation">affiliation</option>
          </select>
          <input class="formInput formValue" type="text" value="거래처" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>
        <div class="inputGroup">
          <select class="dropdown formKey">
            <option value="location_id">location_id</option>
          </select>
          <input class="formInput formValue" type="text" value="ChIJIQBpAG2ahYAR_6128GcTUEo" placeholder="값 입력" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
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
  const itemSection = document.querySelector("#items");
  if (itemSection) {
    const hrTag = itemSection.parentElement;
    itemSection.remove();
    if (hrTag && hrTag.tagName === "HR") hrTag.remove();
  }
}

// 이벤트 타입 설정 함수
function setSelectedButton(event) {
  const buttons = document.querySelectorAll("#eventType .event");
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
    const inputCnt = document.querySelectorAll("#preParam > div.inputGroup").length;
    const seletedEvent = document.querySelector(".select").textContent;
    const limitCnt = seletedEvent === "페이지뷰" ? 2 : 3;
    if (inputCnt < limitCnt) {
      const addButton = document.querySelector("#preParam .addInput");

      // 이미 선택된 옵션 추적
      const usedOptions = Array.from(document.querySelectorAll("#preParam .dropdown")).map((dropdown) => dropdown.value);

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
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>`
      );
    } else {
      alert("모든 매개변수가 추가되었습니다.");
    }
  } else if (type === "transaction") {
    const inputCnt = document.querySelectorAll("#transaction > div.inputGroup").length;
    const limitCnt = 6;
    if (inputCnt < limitCnt) {
      const addButton = document.querySelector("#transaction .addInput");

      // 이미 선택된 옵션 추적
      const usedOptions = Array.from(document.querySelectorAll("#transaction .dropdown")).map((dropdown) => dropdown.value);

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
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>`
      );
    } else {
      alert("모든 매개변수가 추가되었습니다.");
    }
  } else if (type === "items") {
    const inputCnt = document.querySelectorAll("#items > div.inputGroup").length;
    const limitCnt = 18;
    if (inputCnt < limitCnt) {
      const addButton = document.querySelector("#productData");

      // 이미 선택된 옵션 추적
      const usedOptions = Array.from(document.querySelectorAll("#items .dropdown")).map((dropdown) => dropdown.value);

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
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
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
    addButton = document.querySelector("#eventParam .addInput");
    addCountInput = document.getElementById("eventAddCount");
  } else if (type === "userProperty") {
    addButton = document.querySelector("#userProperty .addInput");
    addCountInput = document.getElementById("userAddCount");
  } else if (type === "itemParam") {
    addButton = document.querySelector("#productData");
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
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
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
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
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
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
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
  document.querySelectorAll(".formValue").forEach((formValue) => {
    const key = formValue.parentElement.querySelector(".dropdown")?.value;
    if (!formValue.value) {
      formValue.value = keyMapping(key);
    }
  });
  updateDataObject();
}

// 초기화 실행
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#eventType .event");
  buttons[0].classList.add("select");

  buttons.forEach((button) => {
    button.addEventListener("click", setSelectedButton);
  });

  updatePredefinedOptions("페이지뷰");
  bindRealTimeUpdate();
  updateDataObject(); // 초기 데이터 업데이트
});
