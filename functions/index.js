const { onRequest } = require("firebase-functions/v2/https")

exports.verifyEmail = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" })
  }

  const email = String(req.query.email || "").trim()
  const apiKey = process.env.ABSTRACT_API_KEY

  if (!email) {
    return res.status(400).json({ ok: false, message: "Email is required" })
  }

  if (!apiKey) {
    return res.status(500).json({ ok: false, message: "Missing ABSTRACT_API_KEY" })
  }

  try {
    const url =
      "https://emailreputation.abstractapi.com/v1/?api_key=" +
      apiKey +
      "&email=" +
      encodeURIComponent(email)

    const apiResponse = await fetch(url)
    const data = await apiResponse.json()

    if (!apiResponse.ok) {
      return res.status(400).json({
        ok: false,
        message:
          data &&
          data.error &&
          data.error.message
            ? data.error.message
            : "Abstract API request failed"
      })
    }

    const emailDeliverability = data && data.email_deliverability ? data.email_deliverability : {}
    const emailQuality = data && data.email_quality ? data.email_quality : {}
    const emailRisk = data && data.email_risk ? data.email_risk : {}

    const isFormatValid = emailDeliverability.is_format_valid === true
    const isSmtpValid = emailDeliverability.is_smtp_valid === true
    const isMxValid = emailDeliverability.is_mx_valid === true
    const status = String(emailDeliverability.status || "").toLowerCase()
    const isDisposable = emailQuality.is_disposable === true
    const addressRisk = String(emailRisk.address_risk_status || "").toLowerCase()
    const domainRisk = String(emailRisk.domain_risk_status || "").toLowerCase()

    const accepted =
      isFormatValid &&
      !isDisposable &&
      (isSmtpValid || isMxValid) &&
      status !== "undeliverable" &&
      addressRisk !== "high" &&
      domainRisk !== "high"

    return res.status(200).json({
      ok: true,
      accepted: accepted,
      checks: {
        status: status,
        isFormatValid: isFormatValid,
        isSmtpValid: isSmtpValid,
        isMxValid: isMxValid,
        isDisposable: isDisposable,
        addressRisk: addressRisk,
        domainRisk: domainRisk
      }
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Email verification failed"
    })
  }
})