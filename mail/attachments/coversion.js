
const pdf = require("pdf-creator-node");
const fs = require("fs");
 
module.exports={
    createPdf : function(info , id){
        const html = fs.readFileSync("./mail/attachments/template.html", "utf8");
        var options = {
            format: "A3",
            orientation: "portrait",
            border: "10mm",
        };
        
        const users = [
            {
                name:info.name,
                petname:info.petname,
                email:info.email,
                date :info.date,
                time:info.time,
                animal:info.animal,
                phone:info.phone,
                description:info.description,
                vetname:info.vet.name,
                vetclinicName:info.vet.clinicName,
                clinicAddress:info.vet.clinicAddress,
                vetnumber: info.vet.number,
            }
        ]
        console.log(users)
        
        const document = {
                html: html,
                data: {
                users: users,
                },
                path: `./mail/attachments/pdf/${id}.pdf`,
                type: "",
            };
          pdf.create(document, options).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.error(error);
        });

    }
}