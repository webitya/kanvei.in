"use client"
import { useState } from "react"

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userName.trim() || !comment.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userName: userName.trim(),
          rating,
          comment: comment.trim(),
        }),
      })

      const data = await res.json()
      if (data.success) {
        setUserName("")
        setComment("")
        setRating(5)
        onReviewAdded()
        alert("Review added successfully!")
      }
    } catch (error) {
      console.error("Error adding review:", error)
      alert("Error adding review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
        Write a Review
      </h3>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
        >
          Your Name
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
        >
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
        >
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
      >
        {loading ? "Adding..." : "Add Review"}
      </button>
    </form>
  )
}
