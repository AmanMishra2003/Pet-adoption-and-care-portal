module.exports = {
    template : function(name ,petname, petage, breed, ownerName, ownerEmail, ownerPhone, ){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Adoption Request Approval</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #f9f9f9;
                }
                .header {
                    text-align: center;
                    padding: 10px 0;
                }
                .header h1 {
                    margin: 0;
                    color: #333;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    text-align: center;
                    padding: 10px 0;
                    font-size: 0.8em;
                    color: #666;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    background-color: #28a745;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .button:hover {
                    background-color: #218838;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Congratulations on Your Adoption Approval!</h1>
                </div>
                <div class="content">
                    <p>Dear ${name},</p>
                    <p>We are delighted to inform you that your application to adopt Scooby has been approved! Scooby, our charming ${petage} year old ${breed}, is eager to meet you and hopefully become a cherished member of your family.</p>
                    <p>Here are some details about Scooby:</p>
                    <ul>
                        <li><strong>Name:</strong> ${petname}</li>
                        <li><strong>Age:</strong> ${petage} year</li>
                        <li><strong>Breed:</strong> ${breed}</li>
                    </ul>

                    <p>Owner Details:</p>
                    <ul>
                        <li><strong>Name:</strong> ${ownerName}</li>
                        <li><strong>Email:</strong> ${ownerEmail}</li>
                        <li><strong>Phone Number:</strong> ${ownerPhone}</li>
                    </ul>
                    <p>To proceed with the adoption, please schedule a meeting with Owner at your earliest convenience. </p>
                    <p>Thank you for choosing to adopt and give Scooby a loving forever home. We look forward to seeing you soon!</p>
                    <p>Best regards,</p>
                    <p>PetMatch</p>
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