let eventParamCounter = 2;
let userPropertyCounter = 2;
let gaData = {
  eventParam: {},
  userProperty: {},
  items: [{}],
};

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
  if (transactions) {
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

  gaData = {
    eventParam: {},
    userProperty: {},
    items: [{}],
  };

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

  removeTransactionSection();
  updateDataObject();
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

// 거래 데이터 섹션 추가
function addTransactionSection() {
  const userPropertySection = document.querySelector("#userProperty");

  // 이미 거래 데이터 섹션이 있는 경우 중복 추가 방지
  if (document.querySelector("#transaction")) return;

  const hrTag = document.createElement("hr");

  const transactionSection = document.createElement("div");
  transactionSection.id = "transaction";
  transactionSection.classList.add("section");
  transactionSection.innerHTML = `
    <div class="sessionTitle">거래 매개변수</div>
    <div class="inputGroup">
      <select class="dropdown">
        <option value="currency">currency</option>
        <option value="transaction_id">transaction_id</option>
        <option value="value">value</option>
        <option value="tax">tax</option>
        <option value="shipping">shipping</option>
        <option value="coupon">coupon</option>
      </select>
      <input class="formInput formValue" type="text" placeholder="값 입력" />
      <select class="typeDropdown">
        <option value="str">Str</option>
        <option value="num">Num</option>
      </select>
      <button class="removeButton" onclick="removeInput(this)">-</button>
    </div>
    <button class="addInput" onclick="addInput('transaction')">매개변수 추가</button>
  `;

  // 거래 데이터 섹션 추가
  userPropertySection.after(transactionSection);
  userPropertySection.after(hrTag);
}

// 거래 데이터 섹션 제거
function removeTransactionSection() {
  const transactionSection = document.querySelector("#transaction");
  const hrTag = transactionSection?.previousElementSibling; // 연결된 <hr> 태그 제거
  if (transactionSection) transactionSection.remove();
  if (hrTag && hrTag.tagName === "HR") hrTag.remove();
}

// 이벤트 타입 설정 함수
function setSelectedButton(event) {
  const buttons = document.querySelectorAll("#eventType .event");
  buttons.forEach((button) => button.classList.remove("select"));
  const clickedButton = event.target;
  clickedButton.classList.add("select");

  const selectedEvent = clickedButton.innerText;
  updatePredefinedOptions(selectedEvent);
  resetParametersToDefault();

  // 거래 데이터 섹션 추가/제거
  if (selectedEvent === "전자상거래") {
    addTransactionSection();
  } else {
    removeTransactionSection();
  }

  bindRealTimeUpdate();
  updateDataObject();
}

// 새로운 요소 추가 시 업데이트
function addInput(type) {
  if (type === "prePram") {
    const inputCnt = document.querySelectorAll("#preParam > div.inputGroup").length;
    const seletedEvent = document.querySelector(".select").textContent;
    const limitCnt = seletedEvent === "페이지뷰" ? 2 : 3;
    if (inputCnt < limitCnt) {
      const addButton = document.querySelector("#preParam .addInput");
      addButton.insertAdjacentHTML(
        "beforebegin",
        `<div class="inputGroup">
          <select class="dropdown">
            <option value="contents_group">콘텐츠 그룹</option>
            <option value="user_id">사용자 ID</option>
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
      addButton.insertAdjacentHTML(
        "beforebegin",
        `<div class="inputGroup">
          <select class="dropdown">
            <option value="currency">currency</option>
            <option value="transaction_id">transaction_id</option>
            <option value="value">value</option>
            <option value="tax">tax</option>
            <option value="shipping">shipping</option>
            <option value="coupon">coupon</option>
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
}

function addMultipleInputs(type) {
  const addCountInput = type === "eventParam" ? document.getElementById("eventAddCount") : document.getElementById("userAddCount");
  const count = parseInt(addCountInput.value, 10);
  const addButton = type === "eventParam" ? document.querySelector("#eventParam .addInput") : document.querySelector("#userProperty .addInput");

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

// 초기값 설정 함수
function setInitValue() {
  const formValues = document.querySelectorAll(".formValue");
  formValues.forEach((formValue) => {
    formValue.value = "신기범짱";
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
