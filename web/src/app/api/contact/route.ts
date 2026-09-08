import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const { error: versandFehler } = await resend.emails.send({
      // NOTE: thomato.ch must be verified in Resend (DNS records) before this
      // sender works. Until then the form will fail — see README / handover.
      from: "Thomato <noreply@thomato.ch>",
      to: "info@thomato.ch",
      replyTo: data.email,
      subject: `Neue Anfrage von ${data.name}${data.service ? ` – ${data.service}` : ""}`,
      text: [
        `Name:     ${data.name}`,
        `E-Mail:   ${data.email}`,
        `Telefon:  ${data.phone || "—"}`,
        `Leistung: ${data.service || "—"}`,
        ``,
        `Nachricht:`,
        data.message,
      ].join("\n"),
    });
    if (versandFehler) {
      throw new Error(`Resend: ${versandFehler.message}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: error.issues }, { status: 400 });
    }
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
