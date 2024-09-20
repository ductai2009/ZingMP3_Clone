$(document).ready(function () {
  function addRow(data) {
    var row = `
                  <tr>
                    <td class="header-table">
                      <div class="number width-number is-top-1">
                        <span>1</span>
                      </div>
                    </td>
                      <td>
                          <div class="block">
                              <div class="img-music">
                                  <img class="img-music-view" src="${data.imageSrc}" alt="" />
                              </div>
                              <div class="content">
                                  <div onclick="window.parent.playAudio('${data.srcInd}', '${data.title}', '${data.artist}', '${data.imageSrc}')" class="title__content" data-src="${data.srcInd}">${data.title}</div>
                                  <div class="desc__content">${data.artist} <i class="fa-solid fa-star"></i></div>
                              </div>
                          </div>
                      </td>
                      <td><div class="album-info">${data.album}</div></td>
                      <td>
                          <div class="time-info">
                              <div class="icon-btn plane hidden">
                                  <i class="fa-regular fa-paper-plane"></i>
                              </div>
                              <div class="icon-btn microphone hidden">
                                  <i class="fa-solid fa-microphone"></i>
                              </div>
                              <div class="icon-btn">
                                  <i class="fa-regular fa-heart"></i>
                              </div>
                              <div class="time">${data.time}</div>
                              <div class="icon-btn ellipsis hidden">
                                  <i class="fa-solid fa-ellipsis"></i>
                              </div>
                          </div>
                      </td>
                  </tr>
              `;

    $("#table-music").append(row);
  }

  loadFiles(url_music).then((songs) => {
    if (songs && Object.keys(songs).length > 0) {
      let length_songs = Object.keys(songs).length;
      for (var i = 0; i < length_songs; i++) {
        console.log(songs[i]);
        var newData = {
          imageSrc: songs[i].img,
          srcInd: songs[i].path,
          title: songs[i].name,
          artist: songs[i].author,
          album: songs[i].name + " - " + songs[i].author,
          time: songs[i].duration,
        };
        addRow(newData);
      }
    }
    $(".title__content").on("click", function () {
      // let text = song.name.split(".");
      // let val = text[0].split("-"); // Chia tách phần đầu tiên của chuỗi bằng dấu gạch nối
      // let name = val[0]; // Lấy phần tử thứ hai từ kết quả chia tách
      // let author = val[val.length - 1]; // Lấy phần tử cuối cùng từ kết quả chia tách
      // // let src = text[0];
      // let src_img = song.img;

      let path = $(this).attr("data-src");
      // setInfoMusic("Name", "author", "src_img");

      // playAudio(path, "Name", "author", "src_img");
      NAME_MUSIC.text("ds");
      $("#iframe-container-main").on("load", function () {
        let iframeContent = $(this).contents();
        let imgMusic = iframeContent.find("#name-music");
        console.log("img_music set xong", src_img, imgMusic);
      });
      console.log("ktra giá trị isPlay ", isPlaying);
      // alert("click rồi nhaaaa" + path);
    });
  });
});
