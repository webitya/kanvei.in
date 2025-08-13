"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../../../components/shared/AdminLayout"
import CategoryForm from "../../../components/admin/CategoryForm"

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : "/api/categories"
      const method = editingCategory ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        await fetchCategories()
        setShowForm(false)
        setEditingCategory(null)
        alert(editingCategory ? "Category updated successfully!" : "Category created successfully!")
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error("Error submitting category:", error)
      alert("Error submitting category")
    }
  }

  const handleDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const res = await fetch(`/api/categories/${categoryId}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        await fetchCategories()
        alert("Category deleted successfully!")
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Error deleting category")
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Categories
            </h1>
            <p className="mt-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              Manage your product categories
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
            >
              Add Category
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && <CategoryForm category={editingCategory} onSubmit={handleSubmit} onCancel={handleCancel} />}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              All Categories ({categories.length})
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded h-20 animate-pulse"></div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {category.image && (
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                          {category.name}
                        </h3>
                        <p className="text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-4 py-2 border-2 font-semibold rounded-lg hover:opacity-80 transition-opacity"
                        style={{
                          borderColor: "#8C6141",
                          color: "#8C6141",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                No categories found. Create your first category!
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
