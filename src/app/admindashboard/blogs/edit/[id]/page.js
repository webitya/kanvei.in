"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "../../../../../components/shared/AdminLayout"
import ProtectedRoute from "../../../../../components/ProtectedRoute"
import BlogForm from "../../../../../components/admin/BlogForm"

export default function EditBlog({ params }) {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${id}`)
      if (response.ok) {
        const blogData = await response.json()
        setBlog(blogData)
      } else {
        alert("Blog not found")
        router.push("/admin/blogs")
      }
    } catch (error) {
      console.error("Error fetching blog:", error)
      alert("Failed to load blog")
      router.push("/admin/blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/blogs")
      } else {
        const error = await response.json()
        alert(`Failed to update blog: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating blog:", error)
      alert("Failed to update blog")
    }
  }

  const handleCancel = () => {
    router.push("/admin/blogs")
  }

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <AdminLayout>
          <div className="p-6 text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 mx-auto mb-4"
              style={{ borderColor: "#5A0117", borderTopColor: "transparent", borderWidth: "2px" }}
            ></div>
            <p>Loading blog...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>
        <BlogForm blog={blog} onSubmit={handleSubmit} onCancel={handleCancel} />
      </AdminLayout>
    </ProtectedRoute>
  )
}
