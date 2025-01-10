window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag("js", new Date());
gtag("config", "G-VVYW8HV971", {
  page_title: "GATester",
});

// 데이터 전송 함수
// 전자상거래 추가 필요
function sendGAData() {
  try {
    const eventParam = gaData.eventParam;
    const userProperty = gaData.userProperty;
    let eventName;

    if (document.querySelector(".event.select").textContent === "페이지뷰") {
      eventName = "page_view";
    } else {
      eventName = document.querySelector(".eventName").textContent;
    }

    if (userProperty) {
      gtag("set", "user_properties", userProperty);
    }

    gtag("event", eventName, eventParam);

    console.log("Data successfully sent");
  } catch (error) {
    console.error("Error in sendData:", error);
  }
}
