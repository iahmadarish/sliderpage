import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import Slider from 'react-slick';
import { BsArrowRight } from 'react-icons/bs';
import { FaArrowRightLong } from 'react-icons/fa6';

import slide1 from "../Pages/utils/slider.jpg"
import slide2 from "../Pages/utils/slider2.png"
import slidemobile from "../Pages/utils/mobileview1.jpg"
import slidemobile2 from "../Pages/utils/mobileview2.png"
import joy from "../Pages/utils/ai.png"
import logo from "../Pages/utils/lgoo.svg"

import 'swiper/css';
import 'swiper/css/pagination';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const slides = [
  {
    title: "Welcome to Evoked! I'm Joy 👋",
    description: (
      <>
        Your <span className="md:lg:text-gray-600 md:text-gray-600 text-gray-300">AI-friend for building confidence.</span> I can help you <span className="md:lg:text-gray-600 md:text-gray-600 text-gray-300">pick scents that fits your vibe, feels amazing</span> and <span className="md:lg:text-gray-600 md:text-gray-600 ">gets compliments</span> ❤️
      </>
    ),
    image: slide1,
    mobileImage: slidemobile,
    mascot: joy,
  },
  {
    title: "I'm by your side, whenever you need me 😊",
    description: (
      <>
        When we&apos;re not talking about scents, we can chat about <span className="md:lg:text-gray-600 md:text-gray-600 text-gray-300">work, health</span> and <span className="md:lg:text-gray-600 md:text-gray-600 text-gray-300">relationship problems</span> that&apos;s impacting your confidence levels.
      </>
    ),
    image: slide2,
    mobileImage: slidemobile2,
    mascot: joy,
  }
];

const MobileSlider = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef(null)
  const dragStateRef = useRef({ isEnabled: true })
  
  const [{ x }, api] = useSpring(() => ({ 
    x: 0,
    config: { tension: 300, friction: 20 }
  }))

  const resetDragHandler = () => {
    api.start({ x: 0 })
    setIsDragging(false)
    dragStateRef.current.isEnabled = true
  }

  const bind = useDrag(({ down, movement: [mx], cancel }) => {
    if (!dragStateRef.current.isEnabled) return
    
    setIsDragging(down)
    
    const threshold = window.innerWidth * 0.3
    
    if (down && mx > threshold) {
      cancel()
      if (sliderRef.current && activeIndex === 0) {
        dragStateRef.current.isEnabled = false
        sliderRef.current.slickNext()
        resetDragHandler()
      }
      return
    }

    const maxDrag = window.innerWidth * 0.3
    const boundedX = Math.min(mx, maxDrag)
    
    api.start({ 
      x: down ? boundedX : 0,
      immediate: down
    })
  })

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (_, newIndex) => setActiveIndex(newIndex),
    afterChange: resetDragHandler,
    cssEase: 'linear',
    arrows: false,
    swipe: activeIndex === 1,
    draggable: activeIndex === 1,
    touchMove: activeIndex === 1,
    swipeToSlide: true,
    customPaging: (i) => (
      <div
        style={{
          width: i === activeIndex ? '3.5rem' : '0.5rem',
          height: '0.5rem',
          background: 'white',
          borderRadius: '9999px',
          transition: 'all 0.3s ease',
        }}
      />
    ),
    appendDots: (dots) => (
      <div
        style={{
          position: 'fixed',
          bottom: '25%',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          zIndex: 50
        }}
      >
        {dots}
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-y-hidden bg-black touch-none md:hidden">
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative h-screen">
            <div className="absolute inset-0">
              <img
                src={slide.mobileImage}
                alt="Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
            <div className="relative h-full flex flex-col justify-end items-center px-6 pb-24">
              <div className="w-24 h-24 mb-8">
                <img
                  src={slide.mascot}
                  alt="Joy Robot"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-[20px] w-[343px] px-[16px] font-semibold text-white text-center mb-4">
                {slide.title}
              </h2>
              <p className="text-[#F4F4F4] mt-2 text-center mb-20 text-[20px] leading-relaxed">
                {slide.description}
              </p>

              {index === 0 ? (
                <div className="w-full py-[4px] bg-[#343434] rounded-xl overflow-hidden relative">
                  <animated.div
                    {...bind()}
                    style={{
                      transform: x.to(x => `translateX(${x}px)`),
                      touchAction: 'none',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      zIndex: 10,
                    }}
                    className="p-1"
                  >
                    <div className="h-full px-4 py-4 bg-black rounded-lg flex items-center justify-center">
                      <FaArrowRightLong className="text-white text-2xl" />
                    </div>
                  </animated.div>
                  <div className="h-14 flex ml-[159px] items-center pl-16">
                    <span className="font-medium text-white">Swipe to start</span>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="w-full bg-white text-black py-4 rounded-xl font-medium flex items-center justify-center"
                >
                  Get started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .slick-slide > div {
          height: 100%;
        }
        .slick-track,
        .slick-list {
          height: 100%;
        }
      `}</style>
    </div>
  )
}
const DesktopSlider = ({ slides, activeIndex, handleSlideChange, swiperRef }) => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Swiper
        ref={swiperRef}
        modules={[Pagination]}
        spaceBetween={0}
        slidesPerView={'auto'}
        centeredSlides={true}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !w-2.5 !h-2.5 !bg-white', 
          bulletActiveClass: 'swiper-pagination-bullet-active !w-16 !bg-white',
          el: '.pagination-dots'
        }}
        className="!pb-12 !overflow-hidden"
        onSlideChange={handleSlideChange}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className={`!w-[900px] ${index === activeIndex ? 'active-slide' : 'preview-slide'}`}
          >
            <div className="px-4 relative">
              {index === activeIndex && (
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={slide.mascot}
                      alt="Joy Robot"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 pt-2">
                    <h2 className="text-2xl font-semibold mb-2">{slide.title}</h2>
                    <p className="text-lg leading-relaxed">{slide.description}</p>
                  </div>
                </div>
              )}

              <div className="rounded-2xl overflow-hidden">
                <img
                  src={slide.image}
                  alt="Evoked Product"
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {index === slides.length - 1 && activeIndex === index && (
                <Link
                  to="/login"
                  className="absolute bottom-[-66px] right-3 p-2 transition-transform hover:translate-x-1"
                >
                  <BsArrowRight className="text-3xl text-black" />
                </Link>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-wrapper {
          align-items: stretch;
        }

        .swiper-slide {
          opacity: 0.4;
          transition: opacity 0.3s ease;
        }

        .swiper-slide-active {
          opacity: 1;
        }

        .swiper-pagination {
          position: static !important;
          margin-top: 1rem;
        }

        .swiper-pagination-bullet {
          margin: 0 6px !important;
        }

        @media (min-width: 768px) {
          .preview-slide .flex {
            display: none;
          }

          .preview-slide .rounded-2xl {
            display: block;
            margin-top: 140px;
          }
        }
      `}</style>
    </div>
  );
};

export default function ResponsiveSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div className="">
      {isMobile ? (
        <MobileSlider slides={slides} />
      ) : (
        <DesktopSlider 
          slides={slides} 
          activeIndex={activeIndex} 
          handleSlideChange={handleSlideChange} 
          swiperRef={swiperRef}
        />
      )}
    </div>
  );
}
