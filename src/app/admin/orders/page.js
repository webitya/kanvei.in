"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../../../components/shared/AdminLayout"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()
      if (data.success) {
        await fetchOrders()
        alert("Order status updated successfully!")
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Error updating order status")
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true
    return order.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Orders
            </h1>
            <p className="mt-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              Manage customer orders
            </p>
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              {filter === "all" ? "All Orders" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`} (
              {filteredOrders.length})
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded h-32 animate-pulse"></div>
                ))}
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                          Order #{order._id.slice(-8)}
                        </h3>
                        <p className="text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                          {new Date(order.createdAt).toLocaleDateString()} at{" "}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {order.status}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4
                          className="font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                        >
                          Order Items:
                        </h4>
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                                {item.name} x {item.quantity}
                              </span>
                              <span style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4
                          className="font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                        >
                          Shipping Address:
                        </h4>
                        <div className="text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                          <p>{order.shippingAddress?.name}</p>
                          <p>{order.shippingAddress?.address}</p>
                          <p>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                            {order.shippingAddress?.pincode}
                          </p>
                          <p>{order.shippingAddress?.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                        Payment: {order.paymentMethod}
                      </span>
                      <span className="text-xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                        Total: ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                No orders found for the selected filter.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
