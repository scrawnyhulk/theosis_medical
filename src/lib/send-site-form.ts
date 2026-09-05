const NICK_EMAIL = "nick@theosismedical.com";
const SMS_GATEWAYS = [
  "7654870777@vtext.com",
  "7654870777@txt.att.net",
  "7654870777@tmomail.net",
];

export type SiteFormKind = "inquiry" | "suggestion" | "merch";

export async function sendSiteForm(input: {
  kind: SiteFormKind;
  name: string;
  email: string;
  fields: Record<string, string>;
}) {
  const subject =
    input.kind === "inquiry"
      ? `THEOSIS: New consult request from ${input.name}`
      : input.kind === "merch"
        ? `THEOSIS: Merch interest from ${input.name}`
        : `THEOSIS: New suggestion from ${input.name}`;

  const details = Object.entries(input.fields)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const payload = {
    name: input.name,
    email: input.email,
    _replyto: input.email,
    _subject: subject,
    _template: "table",
    _captcha: "false",
    _honey: "",
    type:
      input.kind === "inquiry"
        ? "Consult request"
        : input.kind === "merch"
          ? "Merch interest"
          : "Suggestion",
    ...input.fields,
  };

  const emailRes = await fetch(
    `https://formsubmit.co/ajax/${NICK_EMAIL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const smsBody = {
    _subject: subject,
    _captcha: "false",
    _honey: "",
    message: `${subject}\n${input.name} <${input.email}>\n${details}`.slice(
      0,
      280,
    ),
  };

  void Promise.allSettled(
    SMS_GATEWAYS.map((to) =>
      fetch(`https://formsubmit.co/ajax/${to}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(smsBody),
      }),
    ),
  );

  if (!emailRes.ok) {
    throw new Error("Could not send right now.");
  }

  const data = (await emailRes.json().catch(() => null)) as {
    success?: boolean | string;
    message?: string;
  } | null;

  if (data && data.success === false) {
    throw new Error(data.message ?? "Could not send right now.");
  }
}
