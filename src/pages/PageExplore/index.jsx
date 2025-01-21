import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostPreview from "../../components/PostPreview";
import { baseURL, APIsRoutes } from "../../utils/services/ApiService";
import TagCarousel from "../../components/Carousel/TagCarousel";

const PageExplore = () => {

    const { data: explorePost, isLoading: isExplorePostLoading, refetch: refetchExplorePost } = useQuery({
        queryKey: ["explore"],
        queryFn: () => {
            return axios.get(baseURL+APIsRoutes.Post.Explore.path,  { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        }
    });

    const [selectedTags, setSelectedTags] = useState([]);

    return (
        <div className="w-full h-screen flex flex-col items-center select-none gap-3 p-3 overflow-y-scroll">
            <TagCarousel selectedTags={selectedTags} setSelectedTags={setSelectedTags}  />
            {explorePost?.data.posts.filter(p => {
                if (selectedTags.length === 0) return true;
                return selectedTags.every(item => p?.tags.includes(item));
            }).map((post, index) => index % 3 === 0 && (
                <div className="w-full flex gap-3 items-center">
                    <div className="w-1/3 aspect-2/3">
                        <PostPreview post={post} />
                    </div>
                    {index + 1 < explorePost?.data.posts.length && <div className="w-1/3 aspect-2/3">
                        <PostPreview post={explorePost?.data.posts[index+1]} />
                    </div>}
                    {index + 2 < explorePost?.data.posts.length && <div className="w-1/3 aspect-2/3">
                        <PostPreview post={explorePost?.data.posts[index+2]} />
                    </div>}
                </div>
            ))}
        </div>
    )
}

export default PageExplore;