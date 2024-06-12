module.exports = {
    template : function(name ,status,comments ){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PetMatch Post Status Notification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f8f8;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px 0;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .content h2 {
                    color: #4CAF50;
                    margin: 0 0 10px;
                }
                .content p {
                    margin: 0 0 10px;
                    line-height: 1.6;
                }
                .footer {
                    background-color: #f1f1f1;
                    text-align: center;
                    padding: 10px 0;
                    font-size: 14px;
                    color: #666;
                }
                .footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>PetMatch</h1>
                </div>
                <div class="content">
                    <h2>Hello, ${name}!</h2>
                    <p>We are writing to inform you that your recent post on PetMatch has been <strong>${status}</strong>.</p>
                    <p>${comments}</p>
                    <p>Thank you for understanding and being a part of the PetMatch community.</p>
                    <p>Best regards,<br>The PetMatch Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 PetMatch. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>

                
        `
    }
}