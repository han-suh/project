// 리액트 컴포넌트는 대문자로 시작해야 리액트가 컴포넌트로 인식
// 컴포넌트 말고 일반 유틸은 함수니까, 보통 자바스크립트 함수 네이밍 룰을 따른다.
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
import {fetchAuth} from "./UserFetch.js";

const serverUrl = "http://localhost:4775";
// const serverUrl = "";
export async function loadUserSettings(userId){
   const url=`${serverUrl}/api/posting/${userId}/setting.do`;
   const resp=await fetchAuth(url);
   if(!resp.ok){throw new Error(resp.status+"")}

   const data=await resp.json();
   return data;
}
export async function loadSaveSettings(userData){
   const url=`${serverUrl}/api/posting/${userData.userId}/setting.do`;
   const resp=await fetchAuth(url, {
      method: "PUT",
      headers : {"Content-Type": "application/json"},
      body: JSON.stringify({
         settingId: userData.settingId,
         userId: userData.userId,
         userEmail: userData.userEmail,
         userName: userData.userName,
         displayColor: userData.displayColor,
         language: userData.language,
         setAt: new Date().toISOString(),
      }),
   })
   return resp;
}
export async function loadWidgetsByUserId(userId){
   const url=`${serverUrl}/api/widgets/used?userId=${userId}`;
   const resp=await fetch(url, {
      credentials: "include"
   })
   if(!resp.ok){throw new Error(resp.status+"")}
   const data=await resp.json();
   return data;
}
export async function loadSaveWidgetsOrder(orderData){
   const url=`${serverUrl}/api/widgets/order`;
   const resp=await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(orderData)
   })
   return resp;
}
export async function loadRemoveWidget(widgetIdNum, userId){
   const url=`${serverUrl}/api/widgets/delete/${widgetIdNum}?userId=${userId}`;
   const resp=await fetch(url, {
      method: "DELETE",
      credentials: "include"
   })
   return resp;
}
export async function loadUser(userId){
   const url=`${serverUrl}/api/posting/${userId}/userpage.do`;
   const token=localStorage.getItem("jwt");
   const resp=await fetch(url, {
      method: "GET",
      headers: {
         'Authorization': `Bearer ${token}`,
      },
      credentials: "include"
   })
   if (!resp.ok) {
      throw new Error(resp.status+"");
   }
   const data=await resp.json();
   console.log(data);
   return data;
}
export async function loadUserPosting(userId){
   const url=`${serverUrl}/api/posting/${userId}/postpage.do`;
   const token=localStorage.getItem("jwt");
   const resp=await fetch(url, {
      method: "GET",
      headers: {
         'Authorization': `Bearer ${token}`,
      },
      credentials: "include"
   })
   if (!resp.ok) {
      throw new Error(resp.status+"");
   }
   const data=await resp.json();
   console.log(data);
   return data;
}
export async function loadSavePostingComment(postId, userId, contents){
   const url=`${serverUrl}/api/posting/comments.do`;
   const token=localStorage.getItem("jwt");
   const resp=await fetch(url, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         'Authorization': `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
         postId : postId,
         userId : userId, //currentUserId(로그인한 사용자의 Id는 useEffect로 받아올 것!)
         contents : contents,
      }),
   });
   return resp;
}
export async function loadPosting(postId){
   const url=`${serverUrl}/api/posting/${postId}/read.do`;
   const token=localStorage.getItem("jwt");
   const resp=await fetch(url, {
      method: "GET",
      headers: {
         'Authorization': `Bearer ${token}`,
      },
      credentials: "include"
   });
   const data=await resp.json();
   return data;
}

export async function loadeventForMain(categoryId, pageSize) {

   const URL = `${serverUrl}/event/cate/${categoryId}/${pageSize}`; // 요청을 보낼 URL. (카테고리 번호와 페이지 크기를 포함)

   const response = await fetch(URL); // 해당 URL로 GET 요청을 보냄
   if (!response.ok) throw new Error(response.status + ""); // 응답 상태가 실패일 경우 에러를 발생시킴

   return await response.json();  // 응답 본문을 JSON 형식으로 파싱해서 반환
};


// 이 함수는 특정 카테고리에 속한 이벤트 목록을 서버에서 받아옴
export async function loadeventsByCtgr(categoryId) {
   const URL = `${serverUrl}/event/cate/${categoryId}`; // 요청을 보낼 URL (카테고리 번호 포함)

   const response = await fetch(URL); // GET 요청 보냄
   if (!response.ok) throw new Error(response.status + ""); // 응답 실패 시 에러 발생

   return await response.json(); // 응답 데이터를 JSON으로 파싱해서 반환
}

// 이벤트 세부 페이지
export async function loadEventOne(eventId) {
   const URL = `${serverUrl}/event/${eventId}`; // 요청을 보낼 URL (이벤트 ID 포함)

   const response = await fetch(URL); // GET 요청 보냄
   if (!response.ok) throw new Error(response.status + ""); // 응답 실패 시 에러 발생

   return await response.json(); // 응답 데이터를 JSON으로 파싱해서 반환
}