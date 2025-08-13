import AdminSidebar from "./AdminSidebar"

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
