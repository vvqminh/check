$(document).ready(function () {
  // Tạo ngôi sao bay lơ lửng trong nền
  var starsContainer = $("#stars");
  var starCount = 60;

  for (var i = 0; i < starCount; i++) {
    var star = $("<div>").addClass("star");

    var size = (Math.random() * 2.2 + 1).toFixed(2); // 1px -> 3.2px
    var left = (Math.random() * 100).toFixed(2); // %
    var top = (Math.random() * 100).toFixed(2); // %
    var duration = (Math.random() * 6 + 4).toFixed(2); // 4s -> 10s trôi dạt
    var driftX = (Math.random() * 40 - 20).toFixed(0); // -20px -> 20px
    var twinkleDuration = (Math.random() * 2.5 + 1.5).toFixed(2); // 1.5s -> 4s
    var delay = (Math.random() * 5).toFixed(2);

    star.css({
      width: size + "px",
      height: size + "px",
      left: left + "%",
      top: top + "%",
      "--drift-x": driftX + "px",
      "animation-duration": duration + "s, " + twinkleDuration + "s",
      "animation-delay": delay + "s, " + delay + "s"
    });

    starsContainer.append(star);
  }

  var flame = $("#flame");
  var txt = $("h1");
  var letter = $("#letter");
  var closeBtn = $("#close-btn");
  var hint = $("#hint");
  var bloom = $("#bloom");
  var revealHint = $("#reveal-hint");

  // Vài cánh hoa bay ra ngay lúc thổi nến (hiệu ứng nhỏ, tức thời)
  function createPetals() {
    var container = $("#petals");
    var rect = flame[0].getBoundingClientRect();
    var originX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    var originY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    var petalCount = 30;

    for (var i = 0; i < petalCount; i++) {
      var petal = $("<div>").addClass("petal petal-c" + (Math.floor(Math.random() * 4) + 1));

      var size = (Math.random() * 20 + 14).toFixed(0);
      var jitterX = (Math.random() * 6 - 3).toFixed(2);
      var jitterY = (Math.random() * 6 - 3).toFixed(2);
      var angle = Math.random() * Math.PI * 2;
      var distance = Math.random() * 40 + 15;
      var tx = (Math.cos(angle) * distance).toFixed(2);
      var ty = (Math.sin(angle) * distance * 0.7).toFixed(2);
      var rot = (Math.random() * 720 - 360).toFixed(0);
      var duration = (Math.random() * 1.3 + 1.7).toFixed(2);
      var delay = (Math.random() * 0.4).toFixed(2);

      petal.css({
        left: (originX + parseFloat(jitterX)) + "vw",
        top: (originY + parseFloat(jitterY)) + "vh",
        width: size + "px",
        height: size + "px",
        "--tx": tx + "vw",
        "--ty": ty + "vh",
        "--rot": rot + "deg",
        "animation-duration": duration + "s",
        "animation-delay": delay + "s"
      });

      container.append(petal);
    }

    setTimeout(function () {
      container.empty();
    }, 3600);
  }

  // Rừng hoa hồng thật (watercolor) nở lan tỏa từ ngọn lửa, phủ kín toàn màn hình
  var flowerImages = [
    "assets/flower-pink.png",
    "assets/flower-blue.png",
    "assets/flower-lotus.png",
    "assets/flower-lily.png"
  ];

  function createBloom() {
    var rect = flame[0].getBoundingClientRect();
    var originXvw = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    var originYvh = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

    // Lưới dày + hoa to, có tràn ra ngoài mép màn hình để không hở viền
    var cols = 9;
    var rows = 8;
    var cellW = 100 / cols;
    var cellH = 100 / rows;
    var startCol = -1, endCol = cols; // tràn thêm 1 cột mỗi bên
    var startRow = -1, endRow = rows; // tràn thêm 1 hàng mỗi bên

    var maxDist = Math.sqrt(100 * 100 + 100 * 100);
    var lastDelay = 0;

    for (var r = startRow; r < endRow; r++) {
      for (var c = startCol; c < endCol; c++) {
        var cx = cellW * c + cellW / 2 + (Math.random() * cellW - cellW / 2);
        var cy = cellH * r + cellH / 2 + (Math.random() * cellH - cellH / 2);

        var src = flowerImages[Math.floor(Math.random() * flowerImages.length)];
        var flower = $("<div>").addClass("flower");
        var img = $("<img>").attr("src", src).attr("alt", "");
        flower.append(img);

        var size = (Math.random() * 12 + 22).toFixed(2); // 22vw -> 34vw, phủ kín và tràn lấp khoảng hở
        var dist = Math.sqrt(Math.pow(cx - originXvw, 2) + Math.pow(cy - originYvh, 2));
        var delay = (dist / maxDist) * 1.0 + Math.random() * 0.25;
        var duration = (Math.random() * 0.4 + 0.7).toFixed(2);
        var endRot = (Math.random() * 60 - 30).toFixed(0);
        var flip = Math.random() < 0.5 ? -1 : 1;
        var z = Math.round(dist); // hoa gần tâm nổi lên trên hoa xa tâm

        lastDelay = Math.max(lastDelay, delay + parseFloat(duration));

        flower.css({
          left: cx + "vw",
          top: cy + "vh",
          width: size + "vw",
          zIndex: 1000 - z,
          "--endrot": endRot + "deg",
          "--flip": flip,
          "animation-duration": duration + "s",
          "animation-delay": delay.toFixed(2) + "s"
        });

        bloom.append(flower);
      }
    }

    // Sau khi hoa nở hết, hiện gợi ý "chạm để mở thư"
    setTimeout(function () {
      revealHint.addClass("show");
      bloom.addClass("ready-to-reveal");
    }, lastDelay * 1000 + 250);
  }

  // Chạm vào rừng hoa để mở lá thư
  bloom.on("click", function () {
    if (!bloom.hasClass("ready-to-reveal")) return;

    revealHint.removeClass("show");
    bloom.removeClass("ready-to-reveal").addClass("fade-out");
    letter.addClass("show");

    setTimeout(function () {
      bloom.empty().removeClass("fade-out");
      bloom.append(revealHint);
    }, 800);
  });

  flame.on("click", function () {
    if ($(this).hasClass("puff")) return;

    // Ẩn gợi ý "press"
    hint.addClass("hint-hide");

    // Vài cánh hoa bay nhẹ ngay lúc thổi nến
    createPetals();

    // Tắt nến
    flame.removeClass("burn").addClass("puff");
    $(".smoke").each(function () {
      $(this).addClass("puff-bubble");
    });
    $("#glow").remove();

    // Đổi câu chúc thành "i wish you happy birthday"
    txt.fadeOut(300, function() {
      $(this).html("i wish you happy birthday").fadeIn(300);
    });

    // Làm mờ nến
    $("#candle").animate({ opacity: "0.5" }, 300);

    // Rừng hoa hồng nở lan tỏa phủ kín màn hình
    setTimeout(function () {
      createBloom();
    }, 250);
  });

  // Đóng bức thư
  closeBtn.on("click", function () {
    letter.removeClass("show");
  });
});