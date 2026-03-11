export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" })
  }

  const email = String(req.query.email || "").trim()

  if (!email) {
    return res.status(400).json({ ok: false, message: "Email is required" })
  }

  if (!process.env.ABSTRACT_API_KEY) {
    return res.status(500).json({ ok: false, message: "Missing ABSTRACT_API_KEY" })
  }

  try {
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}`
    const apiResponse = await fetch(url)
    const data = await apiResponse.json()

    if (!apiResponse.ok) {
      return res.status(400).json({
        ok: false,
        message: data.error?.message || "Abstract API request failed",
        raw: data
      })
    }

    const isValidFormat =
      data.is_valid_format === true ||
      data.is_valid_format?.value === true

    const isDisposable =
      data.is_disposable_email === true ||
      data.is_disposable_email?.value === true

    const isMxFound =
      data.is_mx_found === true ||
      data.is_mx_found?.value === true

    const deliverability = String(data.deliverability || "").toUpperCase()

    const accepted =
      isValidFormat &&
      !isDisposable &&
      isMxFound &&
      deliverability !== "UNDELIVERABLE"

    return res.status(200).json({
      ok: true,
      accepted,
      checks: {
        isValidFormat,
        isDisposable,
        isMxFound,
        deliverability
      },
      raw: data
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Email verification failed"
    })
  }
}