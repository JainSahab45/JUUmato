import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const normalizeVideo = (item) => ({
    _id: item._id,
    video: item.video,
    name: item.name,
    description: item.description || item.name,
    likeCount: item.likeCount ?? item.likesCount ?? (Array.isArray(item.likes) ? item.likes.length : 0),
    savesCount: item.savesCount ?? item.savedBy?.length ?? (Array.isArray(item.savedBy) ? item.savedBy.length : 0),
    commentsCount: item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0),
    foodPartner: item.foodPartner?._id ?? item.foodPartner ?? '',
    isLiked: Boolean(item.isLiked),
    isSaved: Boolean(item.isSaved),
})

const Home = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {
                const items = response.data.foodItems || response.data.fooditem || []
                setVideos(items.map(normalizeVideo))
            })
            .catch(() => {
                setVideos([])
            })
    }, [])

    async function likeVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, { withCredentials: true })

        const nextLike = response.data.like === true
        const nextCount = response.data.likeCount ?? item.likeCount ?? 0

        setVideos((prev) => prev.map((v) => v._id === item._id ? {
            ...v,
            likeCount: nextCount,
            isLiked: nextLike,
        } : v))
    }

    async function saveVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })

        const nextSave = response.data.save === true
        const nextCount = response.data.savesCount ?? item.savesCount ?? 0

        setVideos((prev) => prev.map((v) => v._id === item._id ? {
            ...v,
            savesCount: nextCount,
            isSaved: nextSave,
        } : v))
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home