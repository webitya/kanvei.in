"use client"
import { useRouter } from "next/navigation"
import AdminLayout from "../../../../components/shared/AdminLayout"
import ProtectedRoute from "../../../../components/ProtectedRoute"
import BlogForm from "../../../../components/admin/BlogForm"

export default function NewBlog() {
  const router = useRouter()

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/blogs")
      } else {
        const error = await response.json()
        alert(`Failed to create blog: ${error.error}`)
      }
    } catch (error) {
      console.error("Error creating blog:", error)
      alert("Failed to create blog")
    }
  }

  const handleCancel = () => {
    router.push("/admin/blogs")
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>
        <BlogForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </AdminLayout>
    </ProtectedRoute>
  )
}
