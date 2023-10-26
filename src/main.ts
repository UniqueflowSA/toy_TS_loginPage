import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// firebase app 개인설정
const firebaseConfig = {
  apiKey: "AIzaSyBZtgR2D5g4Amb5qlIC-6A6cVMFlBZQGJ8",
  authDomain: "login-practice-6ffe0.firebaseapp.com",
  databaseURL:
    "https://login-practice-6ffe0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "login-practice-6ffe0",
  storageBucket: "login-practice-6ffe0.appspot.com",
  messagingSenderId: "593914253708",
  appId: "1:593914253708:web:bc239d603c5392117246a9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//value 타입선언
interface TypeSingUpValue {
  [key: string]: string;
  id: string;
  pw: string;
  confirmPw: string;
  name: string;
  phone: string;
}

//HTML태그 가져오기
const modal = document.querySelector("#signUp_modal_page") as HTMLFormElement;
const showSignUpBtn = document.querySelector(
  "#show_signUp_btn"
) as HTMLFormElement;
const closeSignUpBtn = document.querySelector(
  "#close_signUp_btn"
) as HTMLFormElement;
const signUpForm = document.querySelector(
  "#signUpSubmitForm"
) as HTMLFormElement;
const signInForm = document.querySelector("#signInForm") as HTMLFormElement;
const signInErrText = document.querySelector(
  "#signIn_err_div"
) as HTMLFormElement;

//로그인
const signInUser = async () => {
  try {
    const signInFunc = await signInWithEmailAndPassword(
      auth,
      signInForm.signInId.value,
      signInForm.signInPw.value
    );
    const signInUserData = signInFunc.user;
    console.log(signInUserData);

    console.log(signInUserData.uid);
    window.location.href = "/user.html/";
    return signInUserData;
  } catch (err: any) {
    /** 에러 텍스트 생성 */
    const handleErrText = (area: Element, message: string): void => {
      area.insertAdjacentHTML(
        "beforeend",
        `<div class="text-red-600 text-[.7rem] font-medium " id="err_text">${message}</div>`
      );
    };
    console.log(err.code);
    if (err.code === "auth/user-not-found") {
      handleErrText(signInErrText, "찾을 수 없는 사용자입니다.");
    } else {
      handleErrText(signInErrText, "아이디 또는 패스워드를 확인해주세요.");
    }
  }
};
if (signInForm) {
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    removeErrText();
    signInUser();
  });
}

/** 에러텍스트 초기화*/
const removeErrText = () => {
  const findErrText = document.querySelector("#err_text");
  if (findErrText) {
    findErrText.remove();
  }
};
//회원가입모달창 열기
if (showSignUpBtn) {
  showSignUpBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
  //회원가입창 닫기
  closeSignUpBtn.addEventListener("click", () => {
    removeErrText();
    modal.classList.add("hidden");
  });
}

//회원가입
if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    removeErrText();

    /** signUpVinput */
    const signUpValue: TypeSingUpValue = {
      id: signUpForm.signUpId.value,
      pw: signUpForm.signUpPw.value,
      confirmPw: signUpForm.signUpPwConfirm.value,
      name: signUpForm.signUpName.value,
      phone: signUpForm.signUpPhone.value,
    };

    /** 유효성검사 에러텍스트 위치 */
    const signUpErrTextDiv = {
      empty: document.querySelector("#signUp_empty") as HTMLDivElement,
      id: document.querySelector("#signUp_id_div") as HTMLDivElement,
      pw: document.querySelector("#signUp_pw_div") as HTMLDivElement,
      confirmPw: document.querySelector(
        "#signUp_confirmPw_div"
      ) as HTMLDivElement,
      name: document.querySelector("#signUp_name_div") as HTMLDivElement,
      phone: document.querySelector("#signUp_phone_div") as HTMLDivElement,
    };
    //이메일 양식 정규표현식
    const emailIdTest = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    //전화번호 양식 정규표현식
    const phoneNumTest = /^[0-1]{3}[0-9]{7,8}$/;
    /** 에러 텍스트 삽입 */
    const handleErrText = (area: Element, message: string): void => {
      area.insertAdjacentHTML(
        "beforeend",
        `<div class="text-red-600 text-[.8rem] font-medium" id="remove_err_text">${message}</div>`
      );
    };
    /**유효성 검사 */
    //1.작성란이 비었을 때,
    //비어있는 value 검색
    const emptyValueCount = Object.values(signUpValue).filter(
      (item) => item.length === 0
    ).length;
    if (emptyValueCount !== 0) {
      handleErrText(
        signUpErrTextDiv.empty,
        `${emptyValueCount}개의 항목이 비었습니다.`
      );
      return false;
    }
    //2.아이디 형식검사
    if (signUpValue.id.length !== 0 && !emailIdTest.test(signUpValue.id)) {
      handleErrText(signUpErrTextDiv.id, `Id형식이 잘못되었습니다`);
      return false;
    } else if (signUpValue.pw.length !== 0 && signUpValue.pw.length < 5) {
      handleErrText(signUpErrTextDiv.pw, `비밀번호는 6자이상 입력해주세요`);
      return false;
    } else if (signUpValue.pw !== signUpValue.confirmPw) {
      handleErrText(signUpErrTextDiv.confirmPw, `비밀번호가 일치하지않습니다.`);
      return false;
    } else if (!phoneNumTest.test(signUpValue.phone)) {
      handleErrText(signUpErrTextDiv.phone, `전화번호를 확인해주세요.`);
      return false;
    }
    try {
      //회원가입 성공시
      await createUserWithEmailAndPassword(
        auth,
        signUpValue.id,
        signUpValue.pw
      ).then((res) => {
        const user = res.user;
        console.log(user);

        //회원정보저장
        const userInfo = {
          ...signUpValue,
        };
        const userInfoString = JSON.stringify(userInfo);
        localStorage.setItem(user.uid, userInfoString);
        modal.classList.add("hidden");
      });
    } catch (err: any) {
      const errCode = err.code;
      console.log(errCode);
      if (errCode === "auth/email-already-in-use") {
        handleErrText(signUpErrTextDiv.id, `이미 가입한 Id입니다.`);
      }
    }
  });
}

export { auth };
