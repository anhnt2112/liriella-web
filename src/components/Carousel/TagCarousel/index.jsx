import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";
import Tag, { tags } from "../../Tag";

const TagCarousel = ({ selectedTag, setSelectedTag }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  return <div className="w-full h-fit relative select-none flex items-center" ref={emblaRef}>
    <div className="flex gap-2 h-fit items-center">
      <Tag tag={{ label: "All", textColor: "#ffffff", backgroundColor: "#B39DDB" }} className="text-base" onClick={() => setSelectedTag("All")} isActive={selectedTag === "All"} />
      {tags.map(tag => <Tag tag={tag} key={tag.label} className="text-base" onClick={() => setSelectedTag(tag.label)} isActive={selectedTag === tag.label} />)}
    </div>
  </div>;
};

export default TagCarousel;