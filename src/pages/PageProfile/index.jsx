import React from "react";

import Grid from "../../assets/png/grid.png";
import GridFilled from "../../assets/png/grid_filled.png";

import Heart from "../../assets/png/heart.png";
import HeartFilled from "../../assets/png/heart_filled.png";

const PageProfile = () => {
  const [inFavorite, setInFavorite] = React.useState(false);

  return (
    <div className="w-full h-screen flex justify-center select-none">
      <div className="w-full max-w-[1024px]">
        {/* Profile */}
        <div className="w-full px-20 py-10 flex items-center gap-20">
          <img src="https://imgs.search.brave.com/DzYUMuG6uVmYZmZQgrATGPCHt8EYwZUw5lH9TKjuVFo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9kMzhi/MDQ0cGV2bndjOS5j/bG91ZGZyb250Lm5l/dC9jdXRvdXQtbnV4/dC9jYXJ0b29uL25l/dy8xMy5qcGc" className="rounded-full w-40 h-40" draggable={false} />
          <div className="flex-grow h-full flex flex-col gap-2">
            <div>7u4n_4nh</div>
            <div>2 posts</div>
            <div>Full name(1line) and Description</div>
            <div>Facebook and Google</div>
          </div>
        </div>
        {/* Post */}
        <div className="w-full border-t-[1px] border-slate-200 flex justify-center gap-2 mb-10">
          <div className={"w-32 p-2 flex items-center justify-center gap-2 cursor-pointer rounded-b-sm active:text-slate-500 " + (!inFavorite ? "border-t-[1px] border-black" : "")} onClick={() => setInFavorite(false)}>
            <img src={inFavorite ? Grid : GridFilled} alt="grid" className="h-6 p-1" />
            <div className={!inFavorite ? "font-semibold" : ""}>POSTS</div>
          </div>
          <div className={"w-32 p-2 flex items-center justify-center gap-2 cursor-pointer rounded-b-sm active:text-slate-500 " + (inFavorite ? "border-t-[1px] border-black" : "")} onClick={() => setInFavorite(true)}>
            <img src={inFavorite ? HeartFilled : Heart} alt="heart" className="h-6" />
            <div className={inFavorite ? "font-semibold" : ""}>FAVORITE</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-1/4 h-fit">
            <div className="w-full h-fit p-1">
              <div className="w-full aspect-2/3 bg-black"></div>
            </div>
            <div className="w-full h-fit p-1">
              <div className="w-full aspect-2/3 bg-black"></div>
            </div>
          </div>

          <div className="w-1/4 h-fit">
            <div className="w-full h-fit p-1">
              <div className="w-full aspect-2/3 bg-black"></div>
            </div>
            <div className="w-full h-fit p-1">
              <div className="w-full aspect-2/3 bg-black"></div>
            </div>
          </div>

          <div className="w-1/2 h-fit">
            <div className="w-full h-fit p-1">
              <div className="w-full aspect-2/3 bg-black"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageProfile;