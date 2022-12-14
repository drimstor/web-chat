import React from "react";
import { useAppSelector } from "hooks/redux";
import s from "components/Home/HomeFeed/HomeFeed.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import HomeUserBarItem from "../HomeUserBarItem";

function HomeUsersSlider() {
  const user = useAppSelector((state) => state.user);

  let breakpointsInit = 1800;
  let breakpointsArray = [];

  for (let i = 8; i >= 4; i--) {
    const obj = {
      breakpoint: breakpointsInit,
      settings: {
        slidesToShow: i,
      },
    };

    breakpointsArray.push(obj);
    breakpointsInit -= 100;
  }

  const settings = {
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 9,
    slidesToScroll: 1,
    easing: "ease-in-out",
    touchMove: false,
    adaptiveHeight: true,
    responsive: breakpointsArray,
  };

  return (
    <Slider className={s.usersBarSlider} {...settings}>
      <HomeUserBarItem user={user} active />
      <HomeUserBarItem user={user} />
      <HomeUserBarItem user={user} />
      <HomeUserBarItem user={user} active />
      <HomeUserBarItem user={user} />
      <HomeUserBarItem user={user} />
      <HomeUserBarItem user={user} active />
      <HomeUserBarItem user={user} />
      <HomeUserBarItem user={user} />
      <HomeUserBarItem user={user} active />
      <HomeUserBarItem user={user} />
      <HomeUserBarItem user={user} />
    </Slider>
  );
}

export default HomeUsersSlider;
