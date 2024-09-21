$(document).ready(function () {
  const NAME_MUSIC = $("#name-music"); // Sử dụng # cho ID
  const AUTHOR = $("#author"); // Sử dụng # cho ID
  const play = $("#play .fa-play"); // Sử dụng # cho ID
  var pause = $("#play .fa-pause");
  let nextMusic = $("#next-music"); // Sử dụng # cho ID
  let backward = $("#backward"); // Sử dụng # cho ID
  let stop = $("#stop"); // Sử dụng # cho ID
  // const url_music = "./assets/music";
  const url_music = " https://ductai2009.github.io/ZingMP3_Clone/assets/music";
 
  var ind_music = 0;
  var currentFilePath = null;
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var source = null;
  var gainNode = audioContext.createGain(); // Node điều chỉnh âm lượng
  var audioBuffer = null;
  var isPlaying = false;
  var startTime = 0;
  var pausedTime = 0;

  var updateInterval = null;
  var duration = 0; // Thời lượng của bài hát
  var isSeeking = false; // Biến để theo dõi trạng thái thao tác trên thanh range
  var currentVolume = 1.0; // Biến lưu trữ âm lượng hiện tại (giá trị từ 0.0 đến 1.0)
  var seekTime = 0; // Thời gian mới khi người dùng kéo thanh range
  var songs = {};
  // var name = "";
  // var author = "";
  // var src_img = "";
  gainNode.gain.value = 0.5;
  window.hoverCard = function () {
    $(".hover-tooltip").hover(
      function () {
        console.log("hover");
        // Tạo phần tử mới
        var item = `              
  <div id="card__tooltip" class="card__tooltip">
    <div class="card__tooltip__main">
      <div class="header__card">
        <div class="card__user">
          <div class="img">
            <img
              class="img-bg-circle"
              src="./assets/img/img-acc.jpg"
              alt=""
            />
          </div>
          <div class="info">
            <div class="info__title">User</div>
            <div class="info__subtitle">24k Quan tâm</div>
          </div>
        </div>
  
        <div class="action">
          <div class="zm-btn uppercase">Quan tâm</div>
        </div>
      </div>
  
      <div class="desc__card">
        <span
          >Trung Tự là nam ca sĩ có khả năng sáng tác và rap. Anh
          được yêu thích qua các ca khúc "Em À</span
        >
      </div>
  
      <div class="box__card">
        <div class="box__card__header">Mới nhất</div>
        <div class="box__card_content">
          <div class="container gap">
            <div class="block">
              <div class="img-block block-relative box">
                <img
                  class="img"
                  src="./assets/music/img.jpg"
                  alt=""
                />
  
                <div class="block-absolute">
                  <div class="icon icon-btn icon-hover">
                    <i class="fa-solid fa-ellipsis"></i>
                  </div>
                </div>
              </div>
  
              <div class="title-block">Đi tìm tình yêu</div>
              <div class="desc-block">Zing MP3</div>
            </div>
  
            <div class="block">
              <div class="img-block block-relative box">
                <img
                  class="img"
                  src="./assets/music/img.jpg"
                  alt=""
                />
  
                <div class="block-absolute">
                  <div class="icon icon-btn icon-hover">
                    <i class="fa-solid fa-ellipsis"></i>
                  </div>
                </div>
              </div>
  
              <div class="title-block">Hot</div>
              <div class="desc-block">Zing MP3</div>
            </div>
  
            <div class="block">
              <div class="img-block block-relative box">
                <img
                  class="img"
                  src="./assets/music/img.jpg"
                  alt=""
                />
  
                <div class="block-absolute">
                  <div class="icon icon-btn icon-hover">
                    <i class="fa-solid fa-ellipsis"></i>
                  </div>
                </div>
              </div>
  
              <div class="title-block">Hot</div>
              <div class="desc-block">Zing MP3</div>
            </div>
  
            <div class="block">
              <div class="img-block block-relative box">
                <img
                  class="img"
                  src="./assets/music/img.jpg"
                  alt=""
                />
  
                <div class="block-absolute">
                  <div class="icon icon-btn icon-hover">
                    <i class="fa-solid fa-ellipsis"></i>
                  </div>
                </div>
              </div>
  
              <div class="title-block">Hot</div>
              <div class="desc-block">Zing MP3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

        // Thêm phần tử mới sau phần tử đang hover
        $(this).after(item);

        var card = $("#card__tooltip");
        var card_top = "120%";
        var card_bottom = "unset";
        var card_left = "unset";
        var card_right = "unset";
        var card_transform = "unset";

        // $card.show(); // Hiển thị phần tử card

        // Lấy vị trí và kích thước của card
        var rect = card[0].getBoundingClientRect();

        // Kiểm tra nếu phần tử tràn ra ngoài màn hình
        if (rect.right > $(window).width()) {
          // card.css('left', $(window).width() - rect.width + 'px'); // Điều chỉnh vị trí nếu tràn bên phải
          //console.log("Điều chỉnh vị trí nếu tràn bên phải");
          card_right = "50%";
          card_left = "unset";
          card_transform = "translateX(10%)";
        }
        if (rect.bottom > $(window).height()) {
          // $card.css('top', $(window).height() - rect.height + 'px'); // Điều chỉnh vị trí nếu tràn bên dưới
          //console.log("Điều chỉnh vị trí nếu tràn bên dưới");
          card_bottom = "100%";
          card_top = "unset";
        }

        // Kiểm tra tràn bên trái và bên trên (nếu cần)
        if (rect.left < 0) {
          //$card.css('left', '0px'); // Điều chỉnh vị trí nếu tràn bên trái
          //console.log("Điều chỉnh vị trí nếu tràn bên trái");
        }
        if (rect.top < 0) {
          //$card.css('top', '0px'); // Điều chỉnh vị trí nếu tràn bên trên
          //console.log("Điều chỉnh vị trí nếu tràn bên trên");
        }

        card.css({
          top: card_top,
          right: card_right,
          left: card_left,
          bottom: card_bottom,
          transform: card_transform,
        });
      },
      function () {
        // Khi hover ra ngoài, xóa phần tử đã thêm
        $(".card__tooltip").remove();
      }
    );
  };
  hoverCard();
  window.setInfoMusic = function (name, author, src_img) {
    NAME_MUSIC.text(name);
    AUTHOR.text(author);
    //  let src = "./assets/music/img-music/" + str + ".jpg";
    $("#img-music").attr("src", src_img);
    // console.log("name", name);
    // console.log("author", author);
    // console.log("img_music set xong", src_img, $("#author"));
  };
  function encodeString(str) {
    // Xóa khoảng trắng và ký tự đặc biệt, thay khoảng trắng bằng dấu gạch ngang
    return encodeURIComponent(
      str
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "-")
    );
  }

  window.getRandom_Arr = function (arr, num) {
    // Kiểm tra số lượng phần tử yêu cầu không vượt quá số phần tử trong mảng
    if (num > arr.length) {
      throw new Error("Số lượng phần tử yêu cầu lớn hơn số phần tử trong mảng");
    }

    // Tạo bản sao của mảng để không làm thay đổi mảng gốc
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp;
    let index;

    // Xáo trộn mảng
    while (i--) {
      index = Math.floor(Math.random() * (i + 1));
      temp = shuffled[i];
      shuffled[i] = shuffled[index];
      shuffled[index] = temp;
    }

    // Trả về số lượng phần tử ngẫu nhiên dưới dạng mảng
    return shuffled.slice(0, num);
  };

  // Hàm decode: chuyển đổi ngược lại từ URL thành chuỗi
  function decodeString(str) {
    // Decode URL và thay dấu gạch ngang bằng khoảng trắng
    return decodeURIComponent(str.replace(/-/g, " "));
  }
  window.playAudio = function (url, name, author, src_img) {
    if ($("#play-music").hasClass("hidden")) {
      $(":root").css("--size-play-music", "10vh");
      $("#play-music").removeClass("hidden");
      $("#play-music").css("display", "flex");
    }

    console.log(src_img);
    if (currentFilePath !== url) {
      currentFilePath = url;
      pausedTime = 0; // Reset paused time when a new file is loaded
      loadAudio(url, function () {
        if (source) {
          source.stop();
        }
        startAudio(0);

        setInfoMusic(name, author, src_img);
      });
    } else {
      if (isPlaying) {
        stopAudio();
      } else {
        startAudio(pausedTime);
        setInfoMusic(name, author, src_img);
      }
    }
  };
  function isPlay(isPlaying) {
    if (!isPlaying) {
      play.removeClass("hidden");
      pause.addClass("hidden");
    } else {
      play.addClass("hidden");
      pause.removeClass("hidden");
    }
  }

  function startAudio(offset) {
    if (updateInterval) {
      clearInterval(updateInterval); // Dừng tiến trình cập nhật trước đó
    }

    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode).connect(audioContext.destination); // Kết nối source với gainNode để điều chỉnh âm lượng
    source.start(0, offset);

    // Xử lý thời gian
    duration = audioBuffer.duration;
    $("#duration").text(formatTime(duration));

    // Ghi nhớ thời gian bắt đầu phát
    startTime = audioContext.currentTime;

    // Cập nhật thanh tiến trình mỗi giây
    updateInterval = setInterval(function () {
      if (!isSeeking) {
        // Chỉ cập nhật tiến trình khi không đang thao tác với thanh range
        updateProgress(offset);
      }
    }, 500);

    console.log("startAudio");
    isPlaying = true;
    isPlay(isPlaying);
  }

  function stopAudio() {
    if (source) {
      source.stop();
      pausedTime += audioContext.currentTime - startTime; // Cập nhật thời gian đã tạm dừng
      isPlaying = false;
      isPlay(isPlaying);
    }

    if (updateInterval) {
      clearInterval(updateInterval); // Dừng tiến trình cập nhật khi dừng âm thanh
      updateInterval = null;
    }
  }

  function updateProgress(offset) {
    if (source && isPlaying) {
      var currentTime = audioContext.currentTime - startTime + offset;
      $("#currentTime").text(formatTime(currentTime));
      $("#range-time").val((currentTime / duration) * 100);
    }
  }

  function loadAudio(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      audioContext.decodeAudioData(request.response, function (buffer) {
        audioBuffer = buffer;
        if (callback) callback();
      });
    };

    request.send();
  }

  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = Math.floor(seconds % 60);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  // Xử lý khi người dùng thay đổi vị trí của thanh range
  $("#range-time").on("mousedown touchstart", function () {
    if (isPlaying) {
      stopAudio(); // Tạm dừng phát nhạc khi bắt đầu kéo thanh range
    }
    isSeeking = true;
  });

  $("#range-time").on("input", function () {
    if (audioBuffer) {
      var percentage = $(this).val() / 100;
      seekTime = duration * percentage; // Tính toán thời gian mới khi kéo thanh range
      $("#currentTime").text(formatTime(seekTime)); // Cập nhật thời gian trên màn hình
    }
  });

  window.playList = function () {
    $("#iframe-container-main").attr("src", "playList.html");
  };

  $("#range-time").on("mouseup touchend", function () {
    if (audioBuffer) {
      startAudio(seekTime); // Phát lại từ thời gian mới khi thả chuột
      pausedTime = seekTime; // Cập nhật lại thời gian đã tạm dừng
    }
    isSeeking = false;
  });

  // Xử lý khi người dùng thay đổi âm lượng
  $("#volume-control").on("input", function () {
    currentVolume = $(this).val() / 100; // Chuyển giá trị từ 0-100 thành 0.0-1.0
    gainNode.gain.value = currentVolume; // Thiết lập giá trị gain của gainNode
    // console.log("Current Volume:", currentVolume);
  });

  function getFilesFromDirectory(url) {
    return $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
    });
  }

  async function loadFiles(url) {
    try {
      const files = await getFilesFromDirectory(url);
      // const songs = {};
      let ind = 0;
      let src_img;
      for (const file of files) {
        if(!file.includes(".mp3")){
          continue;
        }
        src_img = file.replace(".mp3", ".jpg");
        let arr_file = file.split(".");

        let name_author = arr_file[0].split("-");
        let name = name_author[0];
        let author = name_author[name_author.length - 1];
        let path = url + "/" + file;

        let duration = await getAudioDuration(path); // Đợi cho đến khi duration được lấy

        songs[ind] = {
          stt: ind,
          author: author,
          name: file.split(".")[0].split("-")[0],
          path: path,
          img: url_music + src_img,
          duration: formatTime(duration),
        };
        ind++;
      }

      console.log("songs");
      console.log(songs);
      return songs;
    } catch (error) {
      console.error("Error getting files:", error);
    }
  }

  function getAudioDuration(path) {
    return new Promise((resolve) => {
      const audio = new Audio(path);
      audio.addEventListener("loadedmetadata", function () {
        resolve(audio.duration);
      });
    });
  }

  play.on("click", function () {
    startAudio(pausedTime);
    // setInfoMusic(null, null, null);
    // console.log("play click");

    // loadFiles(url_music).then((songs) => {
    //   if (songs && Object.keys(songs).length > 0) {
    //     let text = songs[ind_music].name.split(".");
    //     let val = text[0].split("-"); // Chia tách phần đầu tiên của chuỗi bằng dấu gạch nối
    //     name = val[0]; // Lấy phần tử thứ hai từ kết quả chia tách
    //     author = val[val.length - 1]; // Lấy phần tử cuối cùng từ kết quả chia tách
    //     // let src = text[0];
    //     src_img = songs[ind_music].img;
    //     // setInfoMusic(name, author, src);
    //     playAudio(songs[ind_music].path, name, author, src_img);
    //     console.log(songs[ind_music].path);
    //   }
    // });
  });

  nextMusic.on("click", function () {
    loadFiles(url_music).then((songs) => {
      if (songs && Object.keys(songs).length > 0) {
        let length_songs = Object.keys(songs).length - 1;

        if (ind_music == length_songs) {
          ind_music = 0;
        } else {
          ind_music++;
        }

        let text = songs[ind_music].name.split(".");
        let val = text[0].split("-"); // Chia tách phần đầu tiên của chuỗi bằng dấu gạch nối
        let name = val[0]; // Lấy phần tử thứ hai từ kết quả chia tách
        let author = val[val.length - 1]; // Lấy phần tử cuối cùng từ kết quả chia tách
        // let src = text[0];
        let src_img = songs[ind_music].img;
        // setInfoMusic(name, author, src);
        playAudio(songs[ind_music].path, name, author, src_img);
      }
    });
  });

  backward.on("click", function () {
    loadFiles(url_music).then((songs) => {
      if (songs && Object.keys(songs).length > 0) {
        let length_songs = Object.keys(songs).length - 1;

        if (ind_music == 0) {
          ind_music = length_songs;
        } else {
          ind_music--;
        }

        let text = songs[ind_music].name.split(".");
        let val = text[0].split("-"); // Chia tách phần đầu tiên của chuỗi bằng dấu gạch nối
        let name = val[0]; // Lấy phần tử thứ hai từ kết quả chia tách
        let author = val[val.length - 1]; // Lấy phần tử cuối cùng từ kết quả chia tách
        // let src = text[0];
        let src_img = songs[ind_music].img;
        // setInfoMusic(name, author, src_img);
        playAudio(songs[ind_music].path, name, author, src_img);
      }
    });
  });

  pause.on("click", function () {
    console.log("Stop music:");
    stopAudio();
  });

  $("#volume-music").click(function () {
    let currentVolume = $("#volume-control").val();
    // console.log("val music:", currentVolume);
    if (currentVolume > 0) {
      // Tắt âm lượng
      initialVolume = currentVolume; // Lưu âm lượng hiện tại
      currentVolume = 0; // Đặt âm lượng về 0

      gainNode.gain.value = currentVolume / 100;

      $("#volume-control").val(currentVolume); // Cập nhật thanh âm lượng
      $("#volume-music-on").addClass("hidden");
      $("#volume-music-off").removeClass("hidden");
    } else {
      // Khôi phục âm lượng
      currentVolume = initialVolume; // Khôi phục âm lượng ban đầu

      gainNode.gain.value = currentVolume / 100;

      console.log("Âm lượng ban đầu: ", currentVolume);
      $("#volume-control").val(currentVolume); // Cập nhật thanh âm lượng
      $("#volume-music-off").addClass("hidden");
      $("#volume-music-on").removeClass("hidden");
    }
  });

  $("#volume-control").on("input", function () {
    let currentVolume = $("#volume-control").val();

    if (currentVolume > 0) {
      $("#volume-music-on").removeClass("hidden");
      $("#volume-music-off").addClass("hidden");
      // console.log(" on val music:", currentVolume);
    } else {
      $("#volume-music-on").addClass("hidden");
      $("#volume-music-off").removeClass("hidden");
      // console.log("off val music:", currentVolume);
    }
  });

  $("#volume-control").on("mouseup touchend", function () {});

  if ($("#play-music").hasClass("hidden")) {
    $("#play-music").css("display", "none");
    $(":root").css("--size-play-music", "-0vh");
  } else {
    $("#play-music").css("display", "flex");
    $(":root").css("--size-play-music", "10vh");
  }

  $("#btn-btn").on("click", function () {
    $("#content-container").load("danh-sach-phat.html");
    console.log("thay đổi");
  });

  $(".zm-navbar-item").on("click", function () {
    $(".zm-navbar-item").removeClass("left-menu-active");
    if (!$(this).hasClass("left-menu-active")) {
      $(this).addClass("left-menu-active");
    }
  });

  $(".logo").on("click", function () {
    $(".zm-navbar-item").removeClass("left-menu-active");
  });

  function hidden_popupBuyAcc() {
    $(".card-main").removeClass("open-flex");
  }

  $(".icon-close").on("click", function () {
    hidden_popupBuyAcc();
  });

  $(".card-main").on("click", function () {
    hidden_popupBuyAcc();
  });

  $(".link-card").on("click", function (event) {
    event.stopPropagation();
  });

  $(".link-card").on("click", function (event) {});

  // BEGIN music table

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
                            <div class="block-relative box-img-bl">
                                <img class="img-music-view" src="${data.imageSrc}" alt="" />
                                <div class="block-absolute">
                                  <div class="icon-btn ">
                                    <i class="fa-solid fa-play opacity-hover"></i>
                                  </div>
                                </div>
                            </div>
                          </div>
                          <div class="content">
                              <div onclick="window.parent.playAudio('${data.srcInd}', '${data.title}', '${data.artist}', '${data.imageSrc}')" class="title__content line-clamp " data-src="${data.srcInd}">${data.title}</div>
                              <div class="desc__content line-clamp  hv-underline">${data.artist} <i class="fa-solid fa-star"></i></div>
                          </div>
                      </div>
                  </td>
                  <td><div class="album-info line-clamp ">${data.album}</div></td>
                  <td>
                      <div class="time-info">
                          <div class="icon-btn icon-hover plane hidden">
                              <i class="fa-regular fa-paper-plane"></i>
                          </div>
                          <div class="icon-btn icon-hover microphone hidden">
                              <i class="fa-solid fa-microphone"></i>
                          </div>
                          <div class="icon-btn icon-hover hidden">
                              <i class="fa-regular fa-heart"></i>
                          </div>
                          <div class="time">${data.time}</div>
                          <div class="icon-btn icon-hover ellipsis hidden">
                              <i class="fa-solid fa-ellipsis"></i>
                          </div>
                      </div>
                  </td>
              </tr>
          `;

    $("#table-music").append(row);
  }
  function addRowChart(data) {
    var row = `
                  <tr>
                    <td class="header-table">
                      <div class="${data.titleChart}">
                        <span>${data.titleText}</span>
                      </div>
                    </td>
                  <td class="col-sort-table">
             
                  <div class="sort ${data.isHiddenSort}"></div>
                  <div class="icon-sort ${data.isHiddenIcon}">
                    <i class="fa-solid fa-caret-${data.cls_upOrDown}"></i>
                    <span>${data.num_sort}</span>
                  </div>
                </td>
                      <td>
                          <div class="block">
                              <div class="img-music">
                                <div class="block-relative box-img-bl">
                                    <img class="img-music-view" src="${data.imageSrc}" alt="" />
                                    <div class="block-absolute">
                                      <div class="icon-btn">
                                        <i class="fa-solid fa-play opacity-hover"></i>
                                      </div>
                                    </div>
                                </div>
                              </div>
                              <div class="content">
                                 
                                    <div data-tooltip = '${data.title}' onclick="window.parent.playAudio('${data.srcInd}', '${data.title}', '${data.artist}', '${data.imageSrc}')" class=" title__content line-clamp" data-src="${data.srcInd}">${data.title}</div>
                                
                                  
                                  <div class="desc__content hv-underline line-clamp">${data.artist} <i class="fa-solid fa-star"></i></div>
                              </div>
                          </div>
                      </td>
                      <td><div class="album-info line-clamp">${data.album}</div></td>
                      <td>
                          <div class="time-info">
     
                              <div class="icon-btn icon-hover microphone hidden">
                                  <i class="fa-solid fa-microphone"></i>
                              </div>
                              <div class="icon-btn icon-hover hidden">
                                  <i class="fa-regular fa-heart"></i>
                              </div>
                              <div class="time">${data.time}</div>
                              <div class="icon-btn icon-hover ellipsis hidden">
                                  <i class="fa-solid fa-ellipsis"></i>
                              </div>
                          </div>
                      </td>
                  </tr>
              `;

    $("#table-chart-music").append(row);
  }

  function addRow3Box(data) {
    var row = `
            <tr>
              <td class="header-table">
                <div class="${data.titleChart}">
                  <span>${data.titleText}</span>
                </div>
              </td>
            <td class="col-sort-table">
              <div class="sort ${data.isHiddenSort}"></div>
              <div class="icon-sort ${data.isHiddenIcon}">
                <i class="fa-solid fa-caret-${data.cls_upOrDown}"></i>
                <span>${data.num_sort}</span>
              </div>
            </td>
                <td>
                    <div class="block">
                        <div class="img-music">
                          <div class="block-relative box-img-bl">
                              <img class="img-music-view" src="${data.imageSrc}" alt="" />
                            <div class="block-absolute">
                              <div class="icon-btn">
                                <i class="fa-solid fa-play opacity-hover"></i>
                              </div>
                        </div>
                      </div>
                        </div>
                        <div class="content">
                            <div onclick="window.parent.playAudio('${data.srcInd}', '${data.title}', '${data.artist}', '${data.imageSrc}')" class="title__content line-clamp" data-src="${data.srcInd}">${data.title}</div>
                            <div class="desc__content hv-underline line-clamp">${data.artist} <i class="fa-solid fa-star"></i></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="time-info">
                        <div class="icon-btn icon-hover plane hidden">
                            <i class="fa-regular fa-paper-plane"></i>
                        </div>
                        <div class="time">${data.time}</div>
                        <div class="icon-btn icon-hover ellipsis hidden">
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                    </div>
                </td>
            </tr>
          `;
    $(`#table-xh-weeb-box${data.tableBox}`).append(row);
  }
  function addRow3Box(data) {
    var row = `
            <tr>
              <td class="header-table">
                <div class="${data.titleChart}">
                  <span>${data.titleText}</span>
                </div>
              </td>
            <td class="col-sort-table">
              <div class="sort ${data.isHiddenSort}"></div>
              <div class="icon-sort ${data.isHiddenIcon}">
                <i class="fa-solid fa-caret-${data.cls_upOrDown}"></i>
                <span>${data.num_sort}</span>
              </div>
            </td>
                <td>
                    <div class="block">
                        <div class="img-music">
                          <div class="block-relative box-img-bl">
                              <img class="img-music-view" src="${data.imageSrc}" alt="" />
                            <div class="block-absolute">
                              <div class="icon-btn">
                                <i class="fa-solid fa-play opacity-hover"></i>
                              </div>
                        </div>
                      </div>
                        </div>
                        <div class="content">
                            <div onclick="window.parent.playAudio('${data.srcInd}', '${data.title}', '${data.artist}', '${data.imageSrc}')" class="title__content line-clamp" data-src="${data.srcInd}">${data.title}</div>
                            <div class="desc__content hv-underline line-clamp">${data.artist} <i class="fa-solid fa-star"></i></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="time-info">
                        <div class="icon-btn icon-hover plane hidden">
                            <i class="fa-regular fa-paper-plane"></i>
                        </div>
                        <div class="time">${data.time}</div>
                        <div class="icon-btn icon-hover ellipsis hidden">
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                    </div>
                </td>
            </tr>
          `;
    $(`#table-xh-weeb-box${data.tableBox}`).append(row);
  }

  function makeCol(data) {
    var td = `<td class="tbl-col box-abs">
              <div class="block">
                <div class="img-music">
                  <div class="block-relative box-img-bl">
                    <img
                      class="img-music-view"
                      src="${data.imageSrc}" alt=""/>
                    <div class="block-absolute absolute-center first-absolute">
                      <div class="icon-btn">
                        <i class="fa-solid fa-play opacity-hover"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <div
                    class="title__content"
                    onclick="window.parent.playAudio"
                  >
                    <div onclick="window.parent.playAudio('${data.srcInd}', '${data.title}', '${data.artist}', '${data.imageSrc}')" class="title__content line-clamp" data-src="${data.srcInd}">${data.title}</div>
                    <div class="tag-img ${data.isTagPre}"></div>
                  </div>
                  <div class="hover-target">
                    <div class="desc__content hv-underline desc-opacity hover-tooltip">
                    
                      ${data.artist}
                      <i class="fa-solid fa-star hidden"></i>
                        
                    </div>
                  </div>
               
                  <div class="desc__content time hv-default desc-opacity">
                    4 giờ trước
                  </div>
                </div>
                <div class="icon-btn icon-hover">
                  <i class="fa-solid fa-ellipsis "></i>
                </div>
              </div>
            </td>`;

    return td;
  }
  function add3ColZingchart_bxh(data) {
    var newItem = `
    <li class="item">
      <div class="box__one">
        <div class="box_one_left number width-number is-top-${data.stt}">
        ${data.stt}
        </div>
        <div class="box_one_right">
          <div class="box__two">
            <div class="box__content">
              <div class="img-music box-abs">
                <div class="block-relative box-img-bl">
                  <img
                    class="img-music-view"
                    src="${data.imageSrc}"
                    alt=""
                  />
                  <div
                    class="block-absolute absolute-center first-absolute"
                  >
                    <div class="icon-btn">
                      <i class="fa-solid fa-play opacity-hover"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="box__text">
                <div class="box__text__title">
                ${data.title}
                </div>
                <div class="box__text__subtitle">${data.artist}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="box__three">
        <span>42%</span>
      </div>
    </li>
  `;

    // Thêm đoạn HTML vào thẻ <ul> với ID list-zingchart-bxh
    $("#list-zingchart-bxh").append(newItem);
  }
  function removeElement(element) {
    element.remove();
  }
  function toast(type, title, content) {
    var toast = $(`
        <div class="toast__card ${type}">
          <div class="card__toast__left">
            <div class="card__icon">
              <i class="fa-solid fa-check"></i>
            </div>
          </div>
          <div class="card__toast__right">
            <div class="card__title">${title}</div>
            <div class="card__content">
            ${content}
            </div>
          </div>
        </div>
    `);

    if ($(".toast__card").length > 4) {
      $(".toast__card")[$(".toast__card").length - 1].remove();
      $("#toast").append(toast);
    } else {
      $("#toast").append(toast);
    }

    const timeAutoRemoveToasst = setTimeout(function () {
      removeElement(toast);
    }, 5000);

    $(".toast__card").on("click", function () {
      removeElement(this);
      clearTimeout(timeAutoRemoveToasst);
    });
  }

  loadFiles(url_music).then((songs) => {
    if (songs && Object.keys(songs).length > 0) {
      let length_songs = Object.keys(songs).length;
      let titleChart = "chart-number-text";
      let titleNumber = "Gợi ý";
      let isHiddenSort = "";
      let isHiddenIcon = "";
      let cls_upOrDown = "up green";
      let num_sort = 0;
      let tableBox = 1;
      let isTagPre = "";
      let indCol = 1;
      let tr_khamPha = $("<tr></tr>");
      let td_khamPha;
      let stt = 1;

      let arr_all = [];
      for (var i = 0; i < length_songs; i++) {
        arr_all.push(i);
      }

      let arr_ = getRandom_Arr(arr_all, 3);

      for (var i = 0; i < length_songs; i++) {
        // console.log(songs[i]);
        if ([5, 6, 4].includes(i)) {
          // Phần thực hiện hiện thanh sort
          num_sort = i; // Phần thực hiện set số sort down or up
          if ([5, 6].includes(i)) {
            // Phần thực hiện hiện thanh sort up
            cls_upOrDown = "up green";
          } else {
            // Phần thực hiện hiện thanh sort down
            cls_upOrDown = "down red";
          }

          isHiddenIcon = "";
          isHiddenSort = "hidden";
        } else {
          // Phần thực hiện hiện thanh ngang
          isHiddenIcon = "hidden";
          isHiddenSort = "";
        }

        if (i !== 0) {
          titleNumber = i;
        }

        if (i > 0 && i < 4) {
          titleChart = `number width-number is-top-${i}`;
        }
        if (i > 3) {
          titleChart = `number width-number`;
        }

        var newData = {
          isHiddenSort: isHiddenSort,
          stt: stt,
          num_sort: num_sort,
          isHiddenIcon: isHiddenIcon,
          cls_upOrDown: cls_upOrDown,
          titleChart: titleChart,
          titleText: titleNumber,
          tableBox: tableBox,
          isTagPre: isTagPre,

          imageSrc: songs[i].img,
          srcInd: songs[i].path,
          title: songs[i].name,
          artist: songs[i].author,
          album: songs[i].name + " - " + songs[i].author,
          time: songs[i].duration,
        };
        addRow(newData);
        td_khamPha = makeCol(newData);
        tr_khamPha.append(td_khamPha);
        indCol++;
        if (arr_.includes(i)) {
          add3ColZingchart_bxh(newData);
          stt++;
        }
        if (indCol == 4) {
          indCol = 1;
          $(`#table-col3_phamPha`).append(tr_khamPha);
          tr_khamPha = $("<tr></tr>");
        }

        if (i < 11) {
          addRowChart(newData);
          // Hiện phần xem thêm
        }
        if (i < 5) {
          newData["titleChart"] = `number width-number`;
          newData["titleText"] = i + 1;
          addRow3Box(newData);
          // Hiện phần xem thêm
        } else {
          if (i > 4 && i < 10) {
            newData["titleChart"] = `number width-number`;
            newData["tableBox"] = tableBox + 1;
            newData["titleText"] = i - 4;
            addRow3Box(newData);
          } else {
            newData["titleChart"] = `number width-number`;
            newData["tableBox"] = tableBox + 2;
            newData["titleText"] = i - 9;
            addRow3Box(newData);
          }
        }
      }
      hoverCard();
    }
    $(".title__content").on("click", function () {
      let path = $(this).attr("data-src");

      // NAME_MUSIC.text("ds");
      $("#iframe-container-main").on("load", function () {
        let iframeContent = $(this).contents();
        let imgMusic = iframeContent.find("#name-music");
        // console.log("img_music set xong", src_img, imgMusic);
      });
      // console.log("ktra giá trị isPlay ", isPlaying);
      // alert("click rồi nhaaaa" + path);
    });
  });

  // END music table

  $("#zingchart").on("click", function () {
    $("#iframe-container-main").attr("src", "zingchart.html");
  });
  $("#thu-vien").on("click", function () {
    $("#iframe-container-main").attr("src", "thu-vien.html");
  });
  $("#nav-radio").on("click", function () {
    $("#iframe-container-main").attr("src", "radio.html");
  });
  $("#nav-kham-pha").on("click", function () {
    $("#iframe-container-main").attr("src", "kham-pha.html");
  });
  $("#nav_BHX_NhacMoi").on("click", function () {
    $("#iframe-container-main").attr("src", "bxh_nhac_moi.html");
  });

  $(".logo").on("click", function () {
    $("#iframe-container-main").attr("src", "playList.html");
    toast("info", "Xin chào", "Chào mừng bạn đến với Zing MP3 Clone.");
  });
  $(".toast-btn").on("click", function () {
    var title = $(this).data("title-toast");
    var content = $(this).data("content-toast");
    toast("info", title, content);
  });

  $(".btn-playList").on("click", function () {
    $(window.parent.document)
      .find("#iframe-container-main")
      .attr("src", "playList.html");
  });
});
