# GA Tester

**GA Tester**는 Google Analytics 4 (GA4) 이벤트 데이터를 보다 효율적으로 설정하고 테스트할 수 있도록 개발된 서비스입니다. 테스트 환경 구축의 번거로움을 최소화하고, 모든 사용자가 데이터를 쉽고 직관적으로 설정 및 확인할 수 있는 UI를 제공합니다. 이를 통해 사용자는 GA4 및 BigQuery 환경에서 효과적으로 테스트를 수행할 수 있습니다.

<br>

## 프로젝트 소개

- **프로젝트명**: GA Tester
- **개발 기간**: 2025. 01. 07 ~ 2025. 01. 21
- **사용 기술**: HTML, CSS, JavaScript
- **개발 멤버**: 신기범, 홍성호
- **프로젝트 배포 URL**: [GA Tester](http://210.114.9.23/GA_part/shhong/workspace/TechProject/Project_WEB_GATester/source/main.html)

<br>

## 주요 기능

![메인 페이지](https://your-image-url.com/main-page-preview)

GA Tester는 간편하고 직관적인 이벤트 설정 및 테스트 환경을 제공합니다.  
다음과 같은 단계를 통해 GA4 데이터를 손쉽게 설정하고 테스트할 수 있습니다:

1. **이벤트 유형 선택**: 페이지뷰, 이벤트, 전자상거래 중 선택
2. **매개변수 입력**: 사전 정의 및 이벤트 매개변수, 사용자 속성 입력 (전자상거래의 경우 거래 및 상품 데이터 포함)
3. **실시간 데이터 확인**: 설정된 이벤트 데이터를 JSON 형식으로 미리보기
4. **데이터 전송**: GA4로 이벤트 데이터를 전송하고 결과 로그 확인

<br>

## 세부 구현 기능

### 1. 이벤트 유형 선택

<p align="center">
 <img src="https://your-image-url.com/event-selection" width="50%" />
</p>

- 페이지뷰, 이벤트, 전자상거래의 이벤트 유형을 손쉽게 선택할 수 있습니다.
- **전자상거래 이벤트**의 경우 거래 및 상품 데이터를 설정할 수 있도록 확장된 입력 UI를 제공합니다.

<br>

### 2. 매개변수 입력 및 설정

<p align="center">
 <img src="https://your-image-url.com/parameter-input" width="50%" />
</p>

- 페이지 정보(제목, URL), 사전 정의 및 이벤트 매개변수, 그리고 사용자 속성을 추가할 수 있습니다.
- **토글 버튼**을 통해 문자열(Str)과 숫자(Num) 유형을 쉽게 변환할 수 있습니다.
- **제거 버튼**을 통해 사용하지 않는 매개변수를 삭제할 수 있습니다.

<br>

### 3. 데이터 실시간 미리보기

<p align="center">
 <img src="https://your-image-url.com/data-preview" width="50%" />
</p>

- 설정된 데이터를 JSON 포맷으로 미리보기 영역에서 실시간 확인할 수 있습니다.
- 자동 포맷팅 및 하이라이팅을 통해 데이터를 보다 쉽게 분석할 수 있습니다.

<br>

### 4. 데이터 전송

<p align="center">
 <img src="https://your-image-url.com/data-submit" width="50%" />
</p>

- **"전송" 버튼 클릭 시**, Google Analytics 4로 이벤트 데이터를 전송합니다.
- GA4와 동시에 BigQuery에서 데이터를 확인할 수 있습니다.

<br>

### 5. 데이터 자동 입력

<p align="center">
 <img src="https://your-image-url.com/data-submit" width="50%" />
</p>

- **우측 상단의 "네모" 버튼**을 클릭하면, 주요 매개변수가 자동으로 입력되어 반복적인 수작업의 번거로움을 줄일 수 있습니다.
- 이를 통해 기본적인 이벤트 설정이 자동화되어 보다 신속한 테스트 환경을 제공합니다.

---

**GA Tester**는 단순한 이벤트 설정 도구를 넘어, 개발자 및 마케터가 GA4 이벤트를 효율적으로 설정하고 테스트할 수 있도록 돕는 강력한 솔루션입니다.
