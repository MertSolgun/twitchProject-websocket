const twitchinput = document.getElementById("purple-checkbox");
const kickinput = document.getElementById("teal-checkbox");

const twitchCard = document.querySelectorAll("#twitch");
const kickCard = document.querySelectorAll("#kick");

const monthlybtn = document.getElementById("monthly");
const weeklybtn = document.getElementById("weekly");

const defaultPrice = document.querySelectorAll(".defaultPrice");
const priceBasic = document.querySelector(".priceBasic");
const priceStandart = document.querySelector(".priceStandart");
const pricePremium = document.querySelector(".pricePremium");
const kickPriceBasic = document.querySelector(".kickPriceBasic");
const kickPriceStandart = document.querySelector(".kickPriceStandart");
const kickPricePremium = document.querySelector(".kickPricePremium");

monthlybtn.addEventListener("click", function () {
  weeklybtn.style.border = "0px";
  defaultPrice.forEach((price) => {
    price.style.display = "none";
  });
  priceBasic.innerHTML =
    "<p class='text-2xl text-white pt-3'>$350/<span class='text-[#14b908]'>Month</span></p>";
  priceStandart.innerHTML =
    "<p class='text-2xl text-white pt-3'>$550/<span class='text-[#14b908]'>Month</span></p>";

  pricePremium.innerHTML =
    "<p class='text-2xl text-white pt-3'>$650/<span class='text-[#14b908]'>Month</span></p>";

  kickPriceBasic.innerHTML =
    "<p class='text-2xl text-white pt-3'>$370/<span class='text-[#14b908]'>Month</span></p>";

  kickPriceStandart.innerHTML =
    "<p class='text-2xl text-white pt-3'>$550/<span class='text-[#14b908]'>Month</span></p>";

  kickPricePremium.innerHTML =
    "<p class='text-2xl text-white pt-3'>$650/<span class='text-[#14b908]'>Month</span></p>";
});

weeklybtn.addEventListener("click", function () {
  defaultPrice.forEach((price) => {
    price.style.display = "none";
  });
  priceBasic.innerHTML =
    "<p class='text-2xl text-white pt-3'>$120/<span class='text-[#14b908]'>Weekly</span></p>";
  priceStandart.innerHTML =
    "<p class='text-2xl text-white pt-3'>$160/<span class='text-[#14b908]'>Weekly</span></p>";
  pricePremium.innerHTML =
    "<p class='text-2xl text-white pt-3'>$250/<span class='text-[#14b908]'>Weekly</span></p>";

  kickPriceBasic.innerHTML =
    "<p class='text-2xl text-white pt-3'>$140/<span class='text-[#14b908]'>Weekly</span></p>";

  kickPriceStandart.innerHTML =
    "<p class='text-2xl text-white pt-3'>$170/<span class='text-[#14b908]'>Weekly</span></p>";

  kickPricePremium.innerHTML =
    "<p class='text-2xl text-white pt-3'>$350/<span class='text-[#14b908]'>Weekly</span></p>";
});

twitchinput.addEventListener("change", function () {
  if (twitchinput.checked) {
    twitchCard.forEach((card) => {
      card.style.display = "block";
    });

    kickCard.forEach((card) => {
      card.style.display = "none";
    });
  } else {
    twitchCard.forEach((card) => {
      card.style.display = "block";
    });

    kickCard.forEach((card) => {
      card.style.display = "none";
    });
  }
});

kickinput.addEventListener("change", function () {
  if (kickinput.checked) {
    kickCard.forEach((card) => {
      card.style.display = "block";
    });

    twitchCard.forEach((card) => {
      card.style.display = "none";
    });
  } else {
    kickCard.forEach((card) => {
      card.style.display = "block";
    });

    twitchCard.forEach((card) => {
      card.style.display = "none";
    });
  }
});
let clientId = "ml9yzgey4jyaj86u6i3fsjt7k0xl26";
let clientSecret = "cll9mbmsaliprkfk5w2vn32bks34t1";

function getTwitchAuthorization() {
  let url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

  return fetch(url, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

async function getUserStream(username) {
  const endpoint = `https://api.twitch.tv/helix/streams?user_login=${username}`;

  let authorizationObject = await getTwitchAuthorization();
  let { access_token, expires_in, token_type } = authorizationObject;

  token_type =
    token_type.substring(0, 1).toUpperCase() +
    token_type.substring(1, token_type.length);

  let authorization = `${token_type} ${access_token}`;

  let headers = {
    authorization,
    "Client-Id": clientId,
  };

  fetch(endpoint, {
    headers,
  })
    .then((res) => res.json())
    .then((data) => renderUserStream(data));
}

// Kullanıcının yayını görüntüleyen fonksiyon
function renderUserStream(data) {
  let { data: streams } = data;
  let streamsContainer = document.querySelector(".streams"); // Özel bir HTML elemanı kullanıcının yayını için

  if (streams.length > 0) {
    let stream = streams[0];
    let { thumbnail_url: thumbnail, title, viewer_count } = stream;
    let hdThumbnail = thumbnail
      .replace("{width}", "1280")
      .replace("{height}", "720");
    streamsContainer.innerHTML = `
      <div class="stream-container">
        <img src="${hdThumbnail}" />
        <h2 class='stream-title'>${title}</h2>
        <div class="stream-viewcount">
        <p><i class="fa-solid fa-user"></i>Live Viewers</p>
        <h2>${viewer_count}</h2>
        </div>
  
      </div>
    `;

    // Kullanıcının çevrimiçi durumu kontrolü
    if (stream.type === "live") {
      streamsContainer.innerHTML +=
        "<div class='stream-status'><p><i class='fa-solid fa-signal'></i>Status:</p><h2>Çevrimiçi</h2></div>";
    } else {
      streamsContainer.innerHTML += "<p>Status Çevrimdışı</p>";
    }
  } else {
    streamsContainer.innerHTML =
      "<p class='nokullanici' style='color:red;'>Kullanıcı şu anda yayın yapmıyor.<p/>";
  }
}

// Kullanıcının takipçi sayısı ve çevrimiçi durumu için yeni fonksiyon
async function getUserInfo(username) {
  const userInfoEndpoint = `https://api.twitch.tv/helix/users?login=${username}`;

  let authorizationObject = await getTwitchAuthorization();
  let { access_token, token_type } = authorizationObject;

  token_type =
    token_type.substring(0, 1).toUpperCase() +
    token_type.substring(1, token_type.length);

  let authorization = `${token_type} ${access_token}`;

  let headers = {
    authorization,
    "Client-Id": clientId,
  };

  fetch(userInfoEndpoint, {
    headers,
  })
    .then((res) => res.json())
    .then((data) => renderUserInfo(data));
}

// Kullanıcının takipçi sayısı ve çevrimiçi durumunu görüntüleyen fonksiyon
function renderUserInfo(data) {
  let { data: users } = data;
  let userContainer = document.querySelector(".user-container"); // Özel bir HTML elemanı kullanıcı bilgileri için

  if (users.length > 0) {
    let user = users[0];
    let { display_name, view_count, broadcaster_type } = user;
    let isOnline = broadcaster_type === "live" ? "Çevrimiçi" : "Çevrimdışı";
    userContainer.innerHTML = `

    `;
  } else {
    userContainer.innerHTML = "Kullanıcı bulunamadı.";
  }
}

// Diğer kodunuzun devamı...

const usernameInput = document.getElementById("username-input");
const submitButton = document.getElementById("check-button");
submitButton.addEventListener("click", () => {
  const username = usernameInput.value;
  getUserStream(username);
  getUserInfo(username); // Kullanıcı bilgilerini ç
});

const testimonialsContainer = document.querySelector(".testimonials-container");
const testimonial = document.querySelector(".testimonial");
const userImage = document.querySelector(".user-image");
const username = document.querySelector(".username");
const role = document.querySelector(".role");

const testimonials = [
  {
    name: "Miyah Myles",
    position: "Marketing",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=707b9c33066bf8808c934c8ab394dff6",
    text: "I've worked with literally hundreds of HTML/CSS developers and I have to say the top spot goes to this guy. This guy is an amazing developer. He stresses on good, clean code and pays heed to the details. I love developers who respect each and every aspect of a throughly thought out design and do their best to put it in code. He goes over and beyond and transforms ART into PIXELS - without a glitch, every time.",
  },
  {
    name: "June Cha",
    position: "Software Engineer",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "This guy is an amazing frontend developer that delivered the task exactly how we need it, do your self a favor and hire him, you will not be disappointed by the work delivered. He will go the extra mile to make sure that you are happy with your project. I will surely work again with him!",
  },
  {
    name: "Iida Niskanen",
    position: "Data Entry",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "This guy is a hard worker. Communication was also very good with him and he was very responsive all the time, something not easy to find in many freelancers. We'll definitely repeat with him.",
  },
  {
    name: "Renee Sims",
    position: "Receptionist",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "This guy does everything he can to get the job done and done right. This is the second time I've hired him, and I'll hire him again in the future.",
  },
  {
    name: "Jonathan Nunfiez",
    position: "Graphic Designer",
    photo: "https://randomuser.me/api/portraits/men/43.jpg",
    text: "I had my concerns that due to a tight deadline this project can't be done. But this guy proved me wrong not only he delivered an outstanding work but he managed to deliver 1 day prior to the deadline. And when I asked for some revisions he made them in MINUTES. I'm looking forward to work with him again and I totally recommend him. Thanks again!",
  },
  {
    name: "Sasha Ho",
    position: "Accountant",
    photo:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?h=350&auto=compress&cs=tinysrgb",
    text: "This guy is a top notch designer and front end developer. He communicates well, works fast and produces quality work. We have been lucky to work with him!",
  },
  {
    name: "Veeti Seppanen",
    position: "Director",
    photo: "https://randomuser.me/api/portraits/men/97.jpg",
    text: "This guy is a young and talented IT professional, proactive and responsible, with a strong work ethic. He is very strong in PSD2HTML conversions and HTML/CSS technology. He is a quick learner, eager to learn new technologies. He is focused and has the good dynamics to achieve due dates and outstanding results.",
  },
];

let idx = 1;

function updateTestimonial() {
  const { name, position, photo, text } = testimonials[idx];

  testimonial.innerHTML = text;
  userImage.src = photo;
  username.innerHTML = name;
  role.innerHTML = position;

  idx++;

  if (idx > testimonials.length - 1) {
    idx = 0;
  }
}

setInterval(updateTestimonial, 10000);
