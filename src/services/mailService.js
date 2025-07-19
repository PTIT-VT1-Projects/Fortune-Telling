import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailService = {
    send: async (email) => {
        const data = {
            service_id: 'service_amrawnk',
            template_id: 'template_4hmc9cz',
            user_id: 'gAKhq8OsMJZanj8w4',
            template_params: {
                'email': email,  // Add the recipient's email address here,
                'content': document.getElementById('emailArea').innerHTML
            }
};

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Không thể gửi email');
        }
    })
    .then(() => {
        alert('Gửi email thành công');
    })
    .catch(error => {
        console.log("Oops: " + error)
    });

    }
}

export default mailService

