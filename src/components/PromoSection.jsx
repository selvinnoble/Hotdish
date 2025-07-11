import React from "react";
import "../components/css/PromoSection.css";
import Slider from "react-slick";
const promoImages = [
  "/assets/img/Promo/promo1.jpg",
  "/assets/img/Promo/promo2.jpg",
  "/assets/img/Promo/promo3.jpg",
  "/assets/img/Promo/promo1.jpg",
  "/assets/img/Promo/promo3.jpg",
];

const PromoSection = () => {
     const settings = {
    dots: true,                // ✅ Enables dots
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,             // Hides next/prev arrows
    appendDots: dots => (
      <div style={{ bottom: "0px" }}>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
  };
   return (
  <div className="py-0 bg-white osahan-promos">
  <div className="px-1">
    <Slider {...settings}>
      {promoImages.map((img, i) => (
        <div className="promo-slide-item" key={i}>
          <a href="/promo-details">
            <div className="promo-wrapper">
              <img
                src={img}
                className="img-fluid mx-auto rounded promo-slide-image"
                alt={`Promo ${i + 1}`}
              />
            </div>
          </a>
        </div>
      ))}
    </Slider>
  </div>
</div>

  );
};

export default PromoSection;
