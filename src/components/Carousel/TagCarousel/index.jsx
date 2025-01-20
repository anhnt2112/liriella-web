import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";
import Tag, { tags } from "../../Tag";
import TagSelect from "../../TagSelect";

const TagCarousel = ({ selectedTags, setSelectedTags }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  return <div className="w-full h-fit relative select-none flex items-center" ref={emblaRef}>
      <TagSelect selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
  </div>;
};

export default TagCarousel;