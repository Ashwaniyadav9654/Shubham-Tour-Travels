export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_8e5dwr5',
  TEMPLATE_ID: 'template_v2k8ecd',
  PUBLIC_KEY: 'h2uK6Wqn9uI4DJKWn',
}

export interface EmailData {
  customer_name: string
  customer_phone: string
  customer_email?: string
  pickup_location: string
  destination: string
  travel_date: string
  passengers?: string
  vehicle?: string
  message?: string
  subject?: string
}

export async function sendBookingEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const messageBody =
      `BOOKING INQUIRY — Shubham Tour & Travels\n` +
      `==========================================\n\n` +
      `Name:       ${data.customer_name}\n` +
      `Phone:      ${data.customer_phone}\n` +
      `Email:      ${data.customer_email || 'Not provided'}\n\n` +
      `Service:    ${data.vehicle || 'Not specified'}\n` +
      `From:       ${data.pickup_location}\n` +
      `To:         ${data.destination}\n` +
      `Date:       ${data.travel_date}\n` +
      `Passengers: ${data.passengers || 'Not specified'}\n\n` +
      `Message:    ${data.message || 'No additional message'}\n\n` +
      `==========================================\n` +
      `Sent from shubhamtourtravels.in`

    const payload = {
      service_id: EMAILJS_CONFIG.SERVICE_ID,
      template_id: EMAILJS_CONFIG.TEMPLATE_ID,
      user_id: EMAILJS_CONFIG.PUBLIC_KEY,
      template_params: {
        // These match the DEFAULT EmailJS "Contact Us" template exactly
        from_name: data.customer_name,
        from_email: data.customer_email || 'noreply@gmail.com',
        to_name: 'Shubham Tour & Travels',
        reply_to: data.customer_email || 'noreply@gmail.com',
        // The default template uses {{name}} and {{message}}
        name: data.customer_name,
        email: data.customer_email || 'Not provided',
        title: `New Booking: ${data.vehicle || 'Inquiry'} | ${data.customer_name}`,
        message: messageBody,
        // Extra fields
        phone: data.customer_phone,
        subject: `New Booking: ${data.vehicle || 'Inquiry'} | ${data.customer_name}`,
      },
    }

    console.log('Sending to EmailJS:', JSON.stringify(payload, null, 2))

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost:5173',
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()
    console.log('EmailJS response:', response.status, responseText)

    if (response.ok) {
      return { success: true }
    } else {
      console.error('EmailJS failed:', response.status, responseText)
      return { success: false, error: `${response.status}: ${responseText}` }
    }
  } catch (err: any) {
    console.error('EmailJS fetch error:', err)
    return { success: false, error: err?.message || 'Network error' }
  }
}
