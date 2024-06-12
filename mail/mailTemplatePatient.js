module.exports = {
    subjectPatient : function(petname,date,time){
        return `Subject: Appointment Confirmation:${petname} - ${date} & ${time}`
    },
    templatePatient : function(id,name,petname,clinicName,Date,time,vetname,Address,phone){
        return `
        🐶
        Dear <b>${name}</b>,
        <br>
        We are thrilled to confirm that your appointment for <b>${petname}</b> has been successfully scheduled at <b>${clinicName}</b>. Below are the details of your appointment:
        <br>
        Appointment Id: <b>${id}</b><br>
        Appointment Date: <b>${Date}</b><br>
        Appointment Time: <b>${time}</b><br>
        Vet's Name: <b>${vetname}</b><br>
        Vet Clinic Name: <b>${clinicName}</b><br>
        Address: <b>${Address}</b><br>
        Contact Number: <b>${phone}</b><br>
        <br>
        <br>
        Please make sure to arrive at least 10 minutes prior to your scheduled appointment time. In the event that you are unable to keep this appointment, kindly notify us at least 24 hours in advance so that we can accommodate other patients.
        <br>
        <br>
        Please note that if any changes occur to your appointment, the clinic will promptly notify you.
        <br>
        <br>
        If you have any inquiries or need further assistance, please do not hesitate to contact us at <b>${phone}</b> or simply respond to this email.
        <br>
        We eagerly anticipate meeting you and your furry friend on <b>${Date}</b>.
        <br><br>
        Warm regards,
        <br><br>
        <b>${clinicName}</b><br>
        <b>${phone}</b>
        `
    }
    
    
    
}
