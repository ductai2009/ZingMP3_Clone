$(document).ready(function () {
  function addRow(data) {
    var row = `
              <tr>
                  <td>
                      <div class="icon">
                          <i class="fa-solid fa-music"></i>
                      </div>
                      <div class="checkbox">
                          <input type="checkbox" class="checkbox-music" />
                      </div>
                  </td>
                  <td>
                      <div class="block">
                          <div class="img-music">
                              <img class="img-music-view" src="${data.imageSrc}" alt="" />
                          </div>
                          <div class="content">
                              <div class="title__content">${data.title}</div>
                              <div class="desc__content">${data.artist} <i class="fa-solid fa-star"></i></div>
                          </div>
                      </div>
                  </td>
                  <td><div class="album-info">${data.album}</div></td>
                  <td>
                      <div class="time-info">
                          <div class="icon-btn">
                              <i class="fa-regular fa-paper-plane"></i>
                          </div>
                          <div class="icon-btn">
                              <i class="fa-solid fa-microphone"></i>
                          </div>
                          <div class="icon-btn">
                              <i class="fa-regular fa-heart"></i>
                          </div>
                          <div class="time">${data.time}</div>
                          <div class="icon-btn">
                              <i class="fa-solid fa-ellipsis"></i>
                          </div>
                      </div>
                  </td>
              </tr>
          `;

    $("#table-music").append(row);
  }

  // Ví dụ về dữ liệu có thể được thêm vào
  $("#add-row-btn").click(function () {
    var newData = {
      imageSrc: "./assets/img/img-user.jpg",
      title: "Rời Bỏ",
      artist: "Hòa Minzi",
      album: "Rời Bỏ (Single)",
      time: "04:37",
    };

    addRow(newData);
  });
});
