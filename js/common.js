// 데이터 업데이트 함수
function updateDataObject() {
  const dataObject = {};

  // 페이지 제목 및 페이지 주소 설정
  const pageTitle = document.getElementById("pageTitle").value;
  const pageURL = document.getElementById("pageURL").value;
  dataObject.page_title = pageTitle;
  dataObject.page_location = pageURL;

  // 사전 정의된 매개변수 설정
  const preParams = document.querySelectorAll(".section.preParam .inputGroup");
  preParams.forEach((group) => {
    const dropdown = group.querySelector(".dropdown").value;
    const input = group.querySelector(".formInput").value;
    const paramType = group.querySelector(".typeDropdown").value;
    if (dropdown && input) {
      dataObject[dropdown] = paramType === "num" ? Number(input) : input;
    }
  });

  // 이벤트 매개변수 설정
  const eventParams = document.querySelectorAll(".section.eventParam .parameterGroup");
  eventParams.forEach((group) => {
    const paramName = group.querySelectorAll(".formInput")[0].value;
    const paramValue = group.querySelectorAll(".formInput")[1].value ? group.querySelectorAll(".formInput")[1].value : "";
    const paramType = group.querySelector(".typeDropdown").value;

    if (paramName) {
      dataObject[`${paramName}`] = paramType === "num" ? Number(paramValue) : paramValue;
    }
  });

  // 사용자 속성 설정
  const userProperties = document.querySelectorAll(".section.userProperty .parameterGroup");
  userProperties.forEach((group) => {
    const propName = group.querySelectorAll(".formInput")[0].value;
    const propValue = group.querySelectorAll(".formInput")[1].value ? group.querySelectorAll(".formInput")[1].value : "";
    const propType = group.querySelector(".typeDropdown").value;

    if (propName) {
      dataObject[`${propName}`] = propType === "num" ? Number(propValue) : propValue;
    }
  });

  // 데이터 표시 영역 업데이트
  const viewDataDiv = document.querySelector(".content.viewData");
  viewDataDiv.innerHTML = `<pre>${JSON.stringify(dataObject, null, 2)}</pre>`;
}

// 실시간 업데이트 이벤트 바인딩
function bindRealTimeUpdate() {
  // 모든 input, select 요소에 이벤트 추가
  const inputs = document.querySelectorAll("input.formInput, select");
  inputs.forEach((input) => {
    input.addEventListener("input", updateDataObject);
    input.addEventListener("change", updateDataObject);
  });
}

// 새로운 요소 추가 시 업데이트
function addInput(type) {
  if (type == "preParam") {
    const optionCnt = document.querySelectorAll(
      "body > div.container > div.contentContainer > div.content.setData > div.section.preParam > div:nth-child(2) > select.dropdown > option"
    ).length;
    const inputCnt = document.querySelectorAll(
      "body > div.container > div.contentContainer > div.content.setData > div.section.preParam > div.inputGroup"
    ).length;
    if (inputCnt < optionCnt) {
      const addButton = document.querySelector(".section.preParam .addInput");
      addButton.insertAdjacentHTML(
        "beforebegin",
        `<div class="inputGroup">
        <select class="dropdown">
          <option value="contents_group">콘텐츠 그룹</option>
          <option value="user_id">사용자 ID</option>
        </select>
        <input class="formInput" type="text" />
        <select class="typeDropdown">
          <option value="str">Str</option>
          <option value="num">Num</option>
        </select>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>`
      );
    }
  } else if (type == "eventParam") {
    const addButton = document.querySelector(".section.eventParam .addInput");
    addButton.insertAdjacentHTML(
      "beforebegin",
      `<div class="parameterGroup">
        <input class="formInput" type="text" />
        <input class="formInput" type="text" />
        <select class="typeDropdown">
          <option value="str">Str</option>
          <option value="num">Num</option>
        </select>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>`
    );
  } else if (type == "userProperty") {
    const addButton = document.querySelector(".section.userProperty .addInput");
    addButton.insertAdjacentHTML(
      "beforebegin",
      `<div class="parameterGroup">
        <input class="formInput" type="text" />
        <input class="formInput" type="text" />
        <select class="typeDropdown">
          <option value="str">Str</option>
          <option value="num">Num</option>
        </select>
        <button class="removeButton" onclick="removeInput(this)">-</button>
      </div>`
    );
  }
  bindRealTimeUpdate(); // 새로 추가된 요소에도 이벤트 바인딩
}

function addMultipleInputs(type) {
  if (type === "eventParam") {
    const addCountInput = document.getElementById("eventAddCount");
    const count = parseInt(addCountInput.value, 10); // 입력된 숫자 가져오기

    const addButton = document.querySelector(".section.eventParam .addInput");

    for (let i = 0; i < count; i++) {
      addButton.insertAdjacentHTML(
        "beforebegin",
        `<div class="parameterGroup">
          <input class="formInput" type="text" />
          <input class="formInput" type="text" />
          <select class="typeDropdown">
            <option value="str">Str</option>
            <option value="num">Num</option>
          </select>
          <button class="removeButton" onclick="removeInput(this)">-</button>
        </div>`
      );
    }

    bindRealTimeUpdate(); // 새로 추가된 요소에 이벤트 바인딩
    updateDataObject(); // 데이터 업데이트
  }
}

// 삭제 함수
function removeInput(button) {
  const parent = button.closest(".inputGroup, .parameterGroup");
  if (parent) {
    parent.remove();
    updateDataObject(); // 삭제 후 데이터 업데이트
  }
}

// 초기화 실행
document.addEventListener("DOMContentLoaded", () => {
  bindRealTimeUpdate();
  updateDataObject(); // 초기 데이터 업데이트
});
