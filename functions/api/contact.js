export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const name = data.name || "No Name";
    const email = data.email || "No Email";
    const about = data.about || "No About";

    const RESEND_API_KEY = "re_UKzTf1P9_N8AUHpPogdtuABcvcUbF2ddu";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Contact Form <onboarding@resend.dev>", // using Resend's default test domain, or they can use their own verified domain
        to: ["csweeneyyt@gmail.com"], // sending to the email registered with Resend account
        subject: `New inquiry from ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>About:</strong> ${about}</p>
        `
      })
    });

    if (res.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      const errorData = await res.text();
      return new Response(JSON.stringify({ success: false, error: errorData }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
