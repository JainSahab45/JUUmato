import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'

const normalizeSavedVideo = (item) => ({
    _id: item._id,
    video: item.video,
    name: item.name,
    description: item.description || item.name,
    likeCount: item.likeCount ?? item.likesCount ?? (Array.isArray(item.likes) ? item.likes.length : 0),
    savesCount: item.savesCount ?? item.savedBy?.length ?? (Array.isArray(item.savedBy) ? item.savedBy.length : 0),
    commentsCount: item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0),
    foodPartner: item.foodPartner?._id ?? item.foodPartner ?? '',
    isSaved: true,
})

const Saved = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3000/api/food/save", { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods || response.data.foodItems || response.data.fooditem || []
                setVideos(savedFoods.map(normalizeSavedVideo))
            })
            .catch(() => {
                setVideos([])
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
            if (response.data.save === false) {
                setVideos((prev) => prev.filter((v) => v._id !== item._id))
            }
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved
