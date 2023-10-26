import axios from "axios";
import { auth } from "./main";
import { onAuthStateChanged } from "firebase/auth";

const welcomeMessage = document.querySelector(
  "#welcome_message"
) as HTMLElement;
const userInfo = document.querySelector("#user_info") as HTMLElement;
const wiseSaying = document.querySelector("#wise_saying") as HTMLElement;
const date = document.querySelector("#date") as HTMLElement;
const timer = document.querySelector("#timer") as HTMLElement;
const weather = document.querySelector("#weather") as HTMLElement;

/** 텍스트삽입 */
const handlePrintText = (area: Element, message: string): void => {
  area.insertAdjacentHTML(
    "beforeend",
    `<div id="signUp_err_text">${message}</div>`
  );
};

//명언 랜덤선택
const wiseSayingArr: string[] = [
  "삶이 있는 한 희망은 있다. <div class='pt-[3rem]'>- Marcus Tullius Cicero</div>",
  "산다는것 그것은 치열한 전투이다. <div class='pt-[3rem]'>- Romain Rolland</div>",
  "하루에 3시간을 걸으면 7년 후에 지구를 한바퀴 돌 수 있다. <div class='pt-[3rem]'>- Samuel Johnson</div>",
  "언제나 현재에 집중할수 있다면 행복할것이다. <div class='pt-[3rem]'>- Paulo Coelho</div>",
  "진정으로 웃으려면 고통을 참아야하며 , 나아가 고통을 즐길 줄 알아야 해. <div class='pt-[3rem]'>- Sir Charlie Chaplin</div>",
  " 신은 용기있는자를 결코 버리지 않는다. <div class='pt-[3rem]'>- Helen Adams Keller</div>",
  " 한번의 실패와 영원한 실패를 혼동하지 마라. <div class='pt-[3rem]'>- F. Scott Fitzgerald</div>",
];
const randomIndex = Math.floor(Math.random() * wiseSayingArr.length);
const randomWiseSaying = wiseSayingArr[randomIndex];
handlePrintText(wiseSaying, randomWiseSaying);
//시계
const today = new Date();
handlePrintText(
  date,
  `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} 
  `
);
const timeFunc = () => {
  const today = new Date();
  const h = String(today.getHours()).padStart(2, "0");
  const m = String(today.getMinutes()).padStart(2, "0");
  const s = String(today.getSeconds()).padStart(2, "0");
  timer.textContent = `${h}:${m}:${s}`;
};

timeFunc();
setInterval(timeFunc, 1000);

//날씨 구하기

const getWeather = async () => {
  const API_KEY = "9b1a11304902351215ecff11c4c7bb1d";
  try {
    const myPosition: GeolocationPosition = await new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
    const latitude = myPosition.coords.latitude;
    const longitude = myPosition.coords.longitude;
    const weatherInfo = axios
      .get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: "metric",
          lang: "kr",
        },
      })
      .then((res) => {
        const temp = res.data.main.temp;
        const place = res.data.name;
        const des = res.data.weather[0].description;
        const engDes = res.data.weather[0].main;
        console.log(res.data);

        handlePrintText(
          weather,
          `<div class="text-[3rem]" >${engDes}</div> <div> ${place} </div> <span class="text-[1.5rem] " >${temp} | ${des} </span>`
        );
      })
      .catch((err) => {
        console.log(err);
      });
    return weatherInfo;
  } catch (err) {
    console.log(err);
    return err;
  }
};
getWeather();
console.log(auth);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`사용자 ${user.email}으로 로그인되었습니다.`);
    const uid = user.uid;
    console.log(`uid: ${uid}.`);
    const getUserInfo = localStorage.getItem(uid);
    let parseCurrentUserInfo;
    if (getUserInfo !== null) {
      parseCurrentUserInfo = JSON.parse(getUserInfo);
    } else {
      console.log("localStorage불러오기 실패");
    }
    handlePrintText(
      welcomeMessage,
      `<span class ="welcomeFont">Welcome!</span><br> <span class="text-[4rem]" >잘왔다, ${parseCurrentUserInfo.name}.</span>`
    );
    handlePrintText(
      userInfo,
      `<span class=" font-medium text-[1rem] " >PhoneNumber:&nbsp; &nbsp;${parseCurrentUserInfo.phone}</span>`
    );
    if (!parseCurrentUserInfo.introduce) {
      handlePrintText(
        userInfo,
        `<span class=" font-medium">Introduce:</span></br>너에게 할 자기소개는 없다. `
      );
    } else {
      handlePrintText(
        userInfo,
        `<span class=" font-medium">Introduce: </span>${parseCurrentUserInfo.introduce}`
      );
    }
  } else {
    console.log("사용자가 로그아웃했습니다.");
    // 로그인 페이지로 이동 또는 다른 조치 수행
  }
});
