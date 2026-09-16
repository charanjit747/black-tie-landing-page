'use client';

import React, { useRef } from 'react';
import Slider, { Settings } from 'react-slick';
import { ChevronLeftIcon, ChevronRightIcon } from '@/constants/icons';

// ── Custom Arrow Components ──────────────────────────────────

interface ArrowProps {
  onClick?: () => void;
  className?: string;
}

const PrevArrow: React.FC<ArrowProps> = ({ onClick, className }) => (
  <button
    className={`slick-arrow slick-prev ${className ?? ''}`}
    onClick={onClick}
    aria-label="Previous slide"
    type="button"
  >
    <ChevronLeftIcon size={18} />
  </button>
);

const NextArrow: React.FC<ArrowProps> = ({ onClick, className }) => (
  <button
    className={`slick-arrow slick-next ${className ?? ''}`}
    onClick={onClick}
    aria-label="Next slide"
    type="button"
  >
    <ChevronRightIcon size={18} />
  </button>
);

// ── Types ────────────────────────────────────────────────────

interface CommonSliderProps extends Partial<Settings> {
  children: React.ReactNode;
  /** Extra class name on the wrapper div */
  className?: string;
  /** Show custom arrows (default: true) */
  showArrows?: boolean;
  /** Show dots (default: true) */
  showDots?: boolean;
}

// ── Component ────────────────────────────────────────────────

export const CommonSlider: React.FC<CommonSliderProps> = ({
  children,
  className = '',
  showArrows = true,
  showDots = true,
  ...slickSettings
}) => {
  const sliderRef = useRef<Slider>(null);

  const defaultSettings: Settings = {
    dots: showDots,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: showArrows,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const settings: Settings = {
    ...defaultSettings,
    ...slickSettings,
    prevArrow: showArrows ? (slickSettings.prevArrow ?? <PrevArrow />) : undefined,
    nextArrow: showArrows ? (slickSettings.nextArrow ?? <NextArrow />) : undefined,
  };

  return (
    <div className={`common-slider ${className}`.trim()}>
      <Slider ref={sliderRef} {...settings}>
        {children}
      </Slider>
    </div>
  );
};

export default CommonSlider;
