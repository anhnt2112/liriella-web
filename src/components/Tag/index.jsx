import React from "react";

export const tags = [
  {
    label: "Fantasy",
    textColor: "#ffffff",
    backgroundColor: "#CE93D8", // Light Purple
  },
  {
    label: "Sci-Fi",
    textColor: "#ffffff",
    backgroundColor: "#81D4FA", // Light Blue
  },
  {
    label: "Mystery",
    textColor: "#ffffff",
    backgroundColor: "#9FA8DA", // Light Indigo
  },
  {
    label: "Thriller",
    textColor: "#ffffff",
    backgroundColor: "#EF9A9A", // Light Red
  },
  {
    label: "Romance",
    textColor: "#ffffff",
    backgroundColor: "#F48FB1", // Light Pink
  },
  {
    label: "Biography",
    textColor: "#000000",
    backgroundColor: "#FFF59D", // Light Yellow
  },
  {
    label: "Self-Help",
    textColor: "#ffffff",
    backgroundColor: "#A5D6A7", // Light Green
  },
  {
    label: "History",
    textColor: "#000000",
    backgroundColor: "#D7CCC8", // Light Brown
  },
  {
    label: "Science",
    textColor: "#ffffff",
    backgroundColor: "#80CBC4", // Light Teal
  },
  {
    label: "Travel",
    textColor: "#ffffff",
    backgroundColor: "#CE93D8", // Light Purple
  },
  {
    label: "Memory",
    textColor: "#ffffff",
    backgroundColor: "#FFAB91", // Light Orange
  },
  {
    label: "Art",
    textColor: "#ffffff",
    backgroundColor: "#B0BEC5", // Light Grey Blue
  },
  {
    label: "Poetry",
    textColor: "#ffffff",
    backgroundColor: "#CFD8DC", // Very Light Blue Grey
  },
  {
    label: "Cookbook",
    textColor: "#000000",
    backgroundColor: "#FFF9C4", // Pale Yellow
  },
  {
    label: "Comics",
    textColor: "#ffffff",
    backgroundColor: "#B39DDB", // Soft Indigo
  },
  {
    label: "Children",
    textColor: "#000000",
    backgroundColor: "#DCEDC8", // Light Lime Green
  },
  {
    label: "Adult",
    textColor: "#ffffff",
    backgroundColor: "#F48FB1", // Soft Pink
  },
];


const Tag = ({ tag, onClick, isActive = false, className = "text-xs" }) => {
  return (
    <div className={"p-1 rounded-lg w-fit h-fit select-none hover:cursor-pointer flex-none flex gap-1 items-center " + className} style={{ backgroundColor: tag?.backgroundColor || "black", color: tag?.textColor || "white" }} onClick={onClick}>
      {tag?.label || ""}
      {isActive && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.textColor }} />}
    </div>
  );
};

export default Tag;