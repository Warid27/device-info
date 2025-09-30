import nodemailer from "nodemailer"

type SendEmailParams = {
	/** Subject of the email */
	subject: string
	/** Plaintext body */
	text?: string
	/** HTML body */
	html?: string
}

const requiredEnv = [
	"SMTP_HOST",
	"SMTP_PORT",
	"SMTP_USER",
	"SMTP_PASS",
]

function assertEnv() {
	for (const key of requiredEnv) {
		if (!process.env[key]) {
			throw new Error(`Missing required env var: ${key}`)
		}
	}
}

export async function sendNotificationEmail(params: SendEmailParams) {
	assertEnv()

	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST as string,
		port: Number(process.env.SMTP_PORT || 587),
		secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for others
		auth: {
			user: process.env.SMTP_USER as string,
			pass: process.env.SMTP_PASS as string,
		},
	})

	const info = await transporter.sendMail({
		from: process.env.SMTP_FROM || process.env.SMTP_USER,
		to: "penyimpananwarid@gmail.com",
		subject: params.subject,
		text: params.text,
		html: params.html,
	})

	return info
}


