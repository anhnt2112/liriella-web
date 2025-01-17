import React, { useState } from "react";
import Tag, { tags } from "../Tag";

const TagSelect = ({ className, ...props }) => {
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleClickTag = (tag) => {
    if (selectedTags.includes(tag.label)) {
      setSelectedTags(selectedTags.filter(item => item !== tag.label));
    } else {
      setSelectedTags([...selectedTags, tag.label]);
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5" {...props}>
      <div>Tags: </div>
      {tags.map(tag => <Tag tag={tag} key={tag.label} onClick={() => handleClickTag(tag)} isActive={selectedTags.includes(tag.label)}/>)}
    </div>
  );
}

export default TagSelect;