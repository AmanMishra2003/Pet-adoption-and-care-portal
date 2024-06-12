
module.exports = {
    subjectClinic : function(){
        return `Subject: Notification: Appointment Scheduled via PetMatch Website`
    },
    templateClinic :function(id,name,petname,clinicName,Date,time,description){
       return `
            Dear <b>${clinicName}</b> Team,
            <br>
            <br>
            - Appointment Id: <b>${id}</b>
            <br>
            <br>
            I hope this email finds you well. I am writing to notify you that a new appointment has been scheduled through the PetMatch website for your clinic.
            <br>
            Here are the appointment details:
            <br>
            - Owner's Name: <b>${name}</b><br>
            - Pet's Name: <b>${petname}</b><br>
            - Appointment Date: <b>${Date}</b><br>
            - Appointment Time: <b>${time}</b><br>
            <br>
            The reason for the appointment is <b>${description}</b>.<br>
            <br>
            Please ensure that the necessary arrangements are made to accommodate this appointment. If any additional information is required or if there are any special considerations for this appointment, please do not hesitate to contact me.
            <br>
            Thank you for your attention to this matter. We appreciate your excellent service and look forward to a successful appointment.
            <br>
            <br>
            Best regards,
            <br>
            <br>
            PetMatch<br>
            www.petmatch.com/customercare
    
        `
    }
    
    
}
 