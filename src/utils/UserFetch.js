const serverUrl        = "http://localhost:4775";
// const serverUrl        = "";
const LOGIN_URL        = `${serverUrl}/user/jwt/login.do`;
const CHECK_LOGIN_URL = `${serverUrl}/user/jwt/check.do`;
const OAUTH_URL = `${serverUrl}/user/oauth/login.do`;

export async function loadUnfollow(followerId,followeeId){
   const url=`${serverUrl}/api/posting/${followerId}/followee.do`;
   const resp =await fetchAuth(url, {
      method: "DELETE",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         followeeId: followeeId,
         followerId: followerId
      })
   });
   return resp;
}
export async function loadFollowers(userId){
   const url=`${serverUrl}/api/posting/${userId}/follower.do`;
   const resp=await fetchAuth(url);
   const data=await resp.json();
   return data;
}
export async function loadSaveFollow({followerId,followeeId}){
   const url=`${serverUrl}/api/posting/${followeeId}/followee.do`;
   const resp =await fetchAuth(url, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         "followeeId": followerId,
         "followerId": followeeId
      })
   });
   return resp;
}
export async function loadFollowee(userId){
   const url=`${serverUrl}/api/posting/${userId}/followee.do`;
   const resp=await fetchAuth(url);
   const data=await resp.json();
   return data;

}

// const LOGIN_URL        = `${serverUrl}/user/jwt/login.do`;
// permitAll에서 로그인을 시도하는 것.
export async function loadLogin(loginUser) {
   // 매개변수 loginUser는 사용자가 입력한 아이디,비번. 그것을 비동기로 서버에 그 정보를 보내는 것.

   const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(loginUser) //  객체를 JSON 문자열로 바꾸는 작업. (보내기전에 작업)
   });

   // 오류일 때 여기서 차단 오류 띄우기.
   if (!response.ok) {
      console.log(response.statusText)
      throw new Error(response.status + "");
   }
   // 성공하면 위를 지나 여기에 도착
   // LoginDto를 서버에서 보내고 있는데, 필드가 두 개임.(jwt user)
   const {jwt, user} = await response.json();
   // user정보 너무 많이 주는데??? (+비밀번호는 막음, 그런데 유저가 만든 이벤트들을 모두 보내고 있음. 나중에 막아야.)
   console.log(jwt, user)

   // jwt있으면, localStorage에 저장시켜서 로그인
   if (jwt) {
      localStorage.setItem("jwt", jwt);
   }

   return user; // 유저정보 보내서 화면 상단에 정보 띄우려고 반환시키는 것.
}



// 모든 요청에 필요한 로그인 정보인 JWT 토큰을 자동으로 포함해서 fetch 요청을 보내는 함수
// 이를 통해 서버에 항상 로그인 정보를 보내게 된다.
export async function fetchAuth(url, option = {}) { // option = {} 는 디폴트 값 넣은 것.

   const jwt = localStorage.getItem("jwt"); // localStorage에 저장된 JWT 토큰를 가지고 있는지 확인

   const response = await fetch(url, {
      ...option, // 전달받은 옵션들을 그대로 복사해서 포함시킴 (예: method, body 등)
      headers: { //
         "Authorization": "Bearer " + jwt,
         ...(option.headers && option.headers) // 만약 option.headers가 있다면 그걸 펼쳐서 헤더에 추가함
         // headers 안에 Authorization 헤더를 강제로 추가하면서도, 사용자가 직접 넘긴 headers도 덮어쓰지 않고 보존
         // 이 구조 덕분에 사용자가 Content-Type, Accept 같은 걸 별도로 지정해도 덮어쓰기 안 됨
      },
      credentials: "include",

   });// 이 headers는 fetch() 함수가 보낼 HTTP 요청(Request)의 헤더입니다.

   if (!response.ok) {
      throw new Error(response.status + "");
   }
   return response;
}


// CHECK_LOGIN_URL = `${serverUrl}/user/jwt/check.do`;
// 로그인이 되어있는지 localStorage에서 확인하고,  true면 보내서 새로 발급. 만료시간을 업데이트 하기 위하여.
export async function loadCheckLogin() {

   const jwtToken = localStorage.getItem("jwt"); // 로컬스토리지에 jwt가 있는지 확인
   if (!jwtToken) { // 없으면 그냥 null반환.
      return null;
   }
   // 있으면 가지고 있는 것으로 서버에 보내서, 유효한지 보고, 새것으로 반환
   const response = await fetchAuth(CHECK_LOGIN_URL); // 얘 리펙터링 했음.(위에있음)
   if (!response.ok) { // 에러가 났으면 (ex 만료)
      localStorage.removeItem("jwt"); // 제거.
   }

   // 에러 안나면, 가지고 와서
   const {jwt, user} = await response.json();
   localStorage.setItem("jwt", jwt); // jwt는 다시 로컬에 저장하고,
   return user; // 유저정보는 다시 반환함. 홍길동님 로그인중 띄우려고.
}




export async function loadGoogleLogin(googleUser) {
   googleUser["oauth"] = "GOOGLE";

   const response = await fetch(OAUTH_URL, { // /user/oauth/login.do
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(googleUser)
   })

   return response;
}
