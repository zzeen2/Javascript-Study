/*
1. 게시글 데이터 구조 만들기 (객체 & 배열)
2. 게시글 추가 기능 (Submit 버튼)
3. 게시글 불러오기 (localStorage에서 데이터 불러와 화면에 표시)
4. 게시글 내용 팝업창 구현
5. 게시글 수정 & 삭제 기능
6. 수정 비밀번호 확인 기능
7. localStorage에 데이터 저장 & 관리
*/

// 이미지 업로드 기능
document.getElementById("imageUpload").addEventListener("change", function(event) {
    const file = event.target.files[0]; // 사용자가 선택한 파일 가져오기
    if (file) {
        const imageUrl = URL.createObjectURL(file); // 파일을 임시 URL로 변환
        document.getElementById("profileImage").src = imageUrl; // 이미지 변경
    }
});

// 게시글 목록을 저장할 배열
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// 게시글을 추가하고 화면을 갱신하는 함수
const savePostsToLocalStorage = () => {
    localStorage.setItem("posts", JSON.stringify(posts));
};

// 게시글 객체 생성
class Post {
    constructor(nickname, title, content, image, password) {
        this.id = Date.now(); // 유니크한 ID
        this.nickname = nickname;
        this.title = title;
        this.content = content;
        this.image = image || "./images/people.png"; // 기본 이미지 설정
        this.password = password; // 수정/삭제 비밀번호
    }
}

// Submit 버튼 이벤트
document.querySelector("button").addEventListener("click", (e) => {
    e.preventDefault();

    // 입력된 값 가져오기
    const nickname = document.querySelector(".name input").value.trim();
    const title = document.querySelector(".title input").value.trim();
    const content = document.querySelector(".contentWriteBox input").value.trim();
    const password = prompt("게시글을 수정하거나 삭제할 때 사용할 비밀번호를 입력하세요.");

    const imageInput = document.querySelector("#imageUpload");
    let image = imageInput.files.length > 0 ? URL.createObjectURL(imageInput.files[0]) : "";

    if (!nickname || !title || !content || !password) {
        alert("모든 항목을 입력하세요!");
        return;
    }

    // 게시글 객체 생성
    const newPost = new Post(nickname, title, content, image, password);
    
    // posts 배열에 추가 & localStorage 저장
    posts.push(newPost);
    savePostsToLocalStorage();
    
    // UI 업데이트
    renderPosts();
    
    // 입력값 초기화
    document.querySelector(".name input").value = "";
    document.querySelector(".title input").value = "";
    document.querySelector(".contentWriteBox input").value = "";
    imageInput.value = "";
});

// 게시글을 화면에 출력하는 함수
const renderPosts = () => {
    const contentBack = document.querySelector(".contentBack");
    contentBack.innerHTML = ""; // 기존 데이터 초기화

    posts.forEach((post) => {
        const postBox = document.createElement("div");
        postBox.classList.add("contentBox");
        postBox.dataset.id = post.id;

        postBox.innerHTML = `
            <img src="${post.image}" alt="profile">
            <h3>${post.nickname}</h3>
            <h4>${post.title}</h4>
            <p class="short-content">...</p> <!-- 항상 '...'만 표시 -->
            <div class="date">${new Date(post.id).toLocaleDateString()}</div>
        `;

        // 내용 클릭하면 팝업창 띄우기
        postBox.querySelector(".short-content").addEventListener("click", () => showPopup(post));

        contentBack.appendChild(postBox);
    });
};

// 페이지 로드 시 데이터 불러오기
document.addEventListener("DOMContentLoaded", renderPosts);

// 게시글 내용 팝업창 띄우기
const showPopup = (post) => {
    const popup = document.createElement("div");
    popup.classList.add("popup");

    popup.innerHTML = `
        <div class="popup-content">
            <h3>${post.nickname}</h3>
            <h4>${post.title}</h4>
            <p>${post.content}</p>
            <button onclick="editPost(${post.id})">수정</button>
            <button onclick="deletePost(${post.id})">삭제</button>
            <button onclick="closePopup()">닫기</button>
        </div>
    `;

    document.body.appendChild(popup);
};

// 팝업창 닫기
const closePopup = () => {
    const popup = document.querySelector(".popup");
    if (popup) popup.remove();
};

// 게시글 수정 기능
const editPost = (id) => {
    const post = posts.find((p) => p.id === id);
    const inputPassword = prompt("수정하려면 비밀번호를 입력하세요.");

    if (inputPassword !== post.password) {
        alert("비밀번호가 틀렸습니다!");
        return;
    }

    const newTitle = prompt("새로운 제목을 입력하세요.", post.title);
    const newContent = prompt("새로운 내용을 입력하세요.", post.content);

    if (newTitle && newContent) {
        post.title = newTitle;
        post.content = newContent;
        savePostsToLocalStorage();
        renderPosts();
        closePopup();
    }
};

// 게시글 삭제 기능
const deletePost = (id) => {
    const post = posts.find((p) => p.id === id);
    const inputPassword = prompt("삭제하려면 비밀번호를 입력하세요.");

    if (inputPassword !== post.password) {
        alert("비밀번호가 틀렸습니다!");
        return;
    }

    const confirmDelete = confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
        posts = posts.filter((p) => p.id !== id);
        savePostsToLocalStorage();
        renderPosts();
        closePopup();
    }
};
