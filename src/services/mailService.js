import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailService = {
    send: async () => {
        const response = await fetch('https://api.postmarkapp.com/email', {
            method: 'POST',
            headers: {
            'X-Postmark-Server-Token': 'be521f1b-61f3-4714-b053-4afae6e67752',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body: JSON.stringify({
            From: 'nguyenhuucam91@gmail.com',
            To: 'aten040791@gmail.com',
            Subject: 'Test Email',
            TextBody: 'Hello, this is a test email!',
            }),
        });

        const data = await response.json();
        console.log(data);
    }
}

export default mailService

