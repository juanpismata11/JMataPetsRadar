import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer'
import { envs } from 'src/config/envs';
import { EmailOptions } from 'src/core/interfaces/mail-options.interface';

@Injectable()
export class EmailService {
    //smtp

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_PASSWORD
        }
    });

    async sendEmail(options: EmailOptions) : Promise<Boolean>{
        try{
            await this.transporter.sendMail({
                to: "juanpismata11@gmail.com",
                subject: options.subject,
                html: options.html
            });
            return true
        } catch (error){
            console.error(error)
            return false;
        }
    }

}
