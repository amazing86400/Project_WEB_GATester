window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag("js", new Date());
gtag("config", "G-VVYW8HV971", {
  page_title: "GATester",
});

// 맞춤 정의 데이터 설정 함수
// 데이터 타입 추가 필요
function collectData(className, prefix) {
  try {
    const elements = document.getElementsByClassName(className);
    if (elements.length < 1) {
      return null;
    }

    let data = {};

    for (let i = 0; i < elements.length; i++) {
      const key = `${prefix}${i + 1}`;
      const value = elements[i].value;
      data[key] = value;
    }
    console.log(`Data collected for ${className}:`, data);

    return data;
  } catch (error) {
    console.error(`Error collecting data for ${className}:`, error);

    return null;
  }
}

// 데이터 전송 함수
// 전자상거래 추가 필요
function sendData() {
  try {
    const rawData = JSON.parse(document.querySelector("body > div.container > div.contentContainer > div.content.viewData > pre").textContent);

    const eventName = document.getElementsByClassName("event-name")[0].value;
    const eventParam = gaData.eventParam;
    const userProperty = gaData.userProperty;

    if (userProperty) {
      gtag("set", "user_properties", userProperty);
    }

    gtag("event", eventName, { ...eventParam });

    console.log("Data successfully sent");
  } catch (error) {
    console.error("Error in sendData:", error);
  }
}
