const userList = document.getElementById("userList");
const userInf = document.getElementById("userInf");
const productList = document.getElementById("productList");
const productEx = document.getElementById("productEx");
const userBasTable = document.getElementById("userBasTable");

const loadData = async function () {
    let resArr = await Promise.all([
        fetch("./loginUser.json"),
        fetch("./products.json")
    ]);

    let objArr = await Promise.all([
        resArr[0].json(),
        resArr[1].json()
    ]);

    const loginUser = objArr[0];
    const products = objArr[1];

    // 로그인정보 불러오기
    for (let logKey in loginUser) {
        let userId = userInf.cloneNode(true);
        userId.removeAttribute("id");
        let userNode = userId.querySelector("." + logKey);
        userNode.innerText = loginUser[logKey];
        userList.append(userNode);
    }

    // 장바구니 불러오기
    let res = await fetch(`./${loginUser["user_id"]}Baskets.json`);
    let baskets = await res.json();

    let userBasketCont = document.getElementById("userBasketCont");
    let totalPrice = 0;

    baskets.baskets.forEach((basket, index) => {
        let basketRow = userBasketCont.querySelector(".userBasketEx").cloneNode(true);
        basketRow.removeAttribute("class");

        basketRow.querySelector(".num").innerText = basket.num;
        basketRow.querySelector(".title").innerText = basket.title;
        basketRow.querySelector(".price").innerText = basket.price.toLocaleString();
        basketRow.querySelector(".cnt").innerText = basket.cnt;
        basketRow.querySelector(".total").innerText = basket.total.toLocaleString();

        // 삭제 버튼 추가
        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.innerText = "삭제";
        basketRow.querySelector(".deleteColumn").appendChild(deleteBtn);

        userBasketCont.appendChild(basketRow);

        // 가격 합계 계산
        totalPrice += basket.total;
    });

    // 전체 가격을 업데이트
    function updateTotalPrice() {
        let total = 0;
        userBasketCont.querySelectorAll("tr").forEach((row) => {
            let totalCell = row.querySelector(".total");
            if (totalCell) {
                total += parseInt(totalCell.innerText.replace(/,/g, ""), 10) || 0; // NaN 방지
            }
        });
        document.getElementById("totalPrice").innerText = total.toLocaleString();
    }

    // 장바구니 가격 합계 초기화
    updateTotalPrice();

    // 상품 목록 정리
    products.forEach((p) => {
        let ex = productEx.cloneNode(true);
        ex.removeAttribute("id");
        for (let proKey in p) {
            let produNode = ex.querySelector("." + proKey);
            let form = ex.querySelector(".basketForm");
            if (proKey === "img[src]") {
                produNode.src = p[proKey];
            } else {
                produNode?.append(document.createTextNode(p[proKey]));
                form[proKey].value = p[proKey];
            }
            productList.append(ex);
        }
    });

    // 이벤트 위임으로 삭제 버튼 처리
    userBasketCont.addEventListener("click", function (event) {
        // 클릭한 요소가 삭제 버튼인지 확인
        if (event.target && event.target.classList.contains("deleteBtn")) {
            let basketRow = event.target.closest("tr");
            // 해당 행 삭제
            basketRow.remove();
            // 가격 합계 업데이트
            updateTotalPrice();
        }
    });
};

// 장바구니 추가 이벤트 처리
productList.addEventListener("submit", function (event) {
    event.preventDefault();

    let form = event.target;
    let product = {
        num: form.num.value,
        title: form.title.value,
        price: parseInt(form.price.value),
        cnt: parseInt(form.cnt.value),
        total: parseInt(form.price.value) * parseInt(form.cnt.value)
    };

    // 장바구니에 상품 추가
    let basketRow = userBasketCont.querySelector(".userBasketEx").cloneNode(true);
    basketRow.removeAttribute("class");

    basketRow.querySelector(".num").innerText = product.num;
    basketRow.querySelector(".title").innerText = product.title;
    basketRow.querySelector(".price").innerText = product.price.toLocaleString();
    basketRow.querySelector(".cnt").innerText = product.cnt;
    basketRow.querySelector(".total").innerText = product.total.toLocaleString();

    // 삭제 버튼 추가
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.innerText = "삭제";
    basketRow.querySelector(".deleteColumn").appendChild(deleteBtn);

    // 장바구니에 추가
    userBasketCont.appendChild(basketRow);

    // 가격 합계 업데이트
    updateTotalPrice();
});

loadData();
