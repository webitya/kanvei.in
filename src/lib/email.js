import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Kanvei" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error: error.message }
  }
}

export const sendOrderConfirmationEmail = async (order, customerEmail) => {
  const subject = `Order Confirmation - #${order._id.slice(-8)}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #5A0117; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #5A0117; }
        .footer { text-align: center; padding: 20px; color: #8C6141; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-family: 'Sugar', serif;">Kanvei</h1>
          <p style="margin: 10px 0 0 0;">Thank you for your order!</p>
        </div>
        
        <div class="content">
          <h2 style="color: #5A0117;">Order Confirmation</h2>
          <p>Dear ${order.shippingAddress?.name || "Customer"},</p>
          <p>Thank you for your order! We're excited to confirm that we've received your order and it's being processed.</p>
          
          <div class="order-details">
            <h3 style="color: #5A0117; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> #${order._id.slice(-8)}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
            
            <h4 style="color: #5A0117;">Items Ordered:</h4>
            ${
              order.items
                ?.map(
                  (item) => `
              <div class="item">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `,
                )
                .join("") || ""
            }
            
            <div class="item total">
              <span>Total Amount</span>
              <span>₹${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="order-details">
            <h4 style="color: #5A0117; margin-top: 0;">Shipping Address</h4>
            <p>
              ${order.shippingAddress?.name}<br>
              ${order.shippingAddress?.address}<br>
              ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.pincode}<br>
              Phone: ${order.shippingAddress?.phone}
            </p>
          </div>
          
          <p>We'll send you another email with tracking information once your order ships.</p>
          <p>If you have any questions about your order, please contact us at kanvei.in@gmail.com or +91 7488425690.</p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Kanvei!</p>
          <p style="font-size: 12px;">This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail(customerEmail, subject, html)
}

export const sendContactEmail = async (name, email, subject, message) => {
  const emailSubject = `Contact Form: ${subject}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #5A0117; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .message-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-family: 'Sugar', serif;">Kanvei</h1>
          <p style="margin: 10px 0 0 0;">New Contact Form Submission</p>
        </div>
        
        <div class="content">
          <div class="message-box">
            <h3 style="color: #5A0117; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            
            <h4 style="color: #5A0117;">Message:</h4>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail(process.env.EMAIL_USER, emailSubject, html)
}
