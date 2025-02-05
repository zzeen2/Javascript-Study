//이미지 업로드
document.getElementById("imageUpload").addEventListener("change", function(event) {
    const file = event.target.files[0]; // 사용자가 선택한 파일 가져오기
    if (file) {
        const imageUrl = URL.createObjectURL(file); // 파일을 임시 URL로 변환
        document.getElementById("profileImage").src = imageUrl; // 이미지 변경
    }
});
