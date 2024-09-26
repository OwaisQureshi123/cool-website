
$(function()
{
    function after_form_submitted(data) 
    {

        if(data.status == 201 || data.status == 200)
        {
            $('#success_message').show();
            $('#error_message').hide();
        }
        else
        {
            $('#error_message').append('<ul></ul>');

            jQuery.each(data.errors,function(key,val)
            {
                $('#error_message ul').append('<li>'+key+':'+val+'</li>');
            });
            $('#success_message').hide();
            $('#error_message').show();

            //reverse the response on the button
            $('button[type="button"]', $form).each(function()
            {
                $btn = $(this);
                label = $btn.prop('orig_label');
                if(label)
                {
                    $btn.prop('type','submit' ); 
                    $btn.text(label);
                    $btn.prop('orig_label','');
                }
            });
            
        }//else
    }

	$('#contact_form').submit(function(e){
        
        e.preventDefault();

        $form = $(this);

        //show some response on the button
        $('button[type="submit"]', $form).each(function(){
            $btn = $(this);
            $btn.prop('type','button' ); 
            $btn.prop('orig_label',$btn.text());
            $btn.text('Sending ...');
        });

        // Example URL with query parameters
        const url = $form.serialize();

        // Create a URL object
        const urlObj = new URLSearchParams(url);

        // Use URLSearchParams to get query parameters
        const responseParams = new URLSearchParams(urlObj);

        // Convert query parameters to a JSON object
        const jsonParams = {};
        responseParams.forEach((value, key) => {
            jsonParams[key] = value;
        });

        // Convert the JSON object to a string (optional)
        // const jsonString = JSON.stringify(jsonParams);

        // Log the JSON object and string

        var patientName = jsonParams["Name"];
        var patientEmail = jsonParams["Email"];
        var patientMessage = jsonParams["message"];
        var patientPhone = jsonParams["phone"];
        var patientService = jsonParams["service"];
        var patientTime = jsonParams["time"];

        var params = JSON.stringify({
            // "sender":{
            //     "email":"umerkhattab42@gmail.com",
            //     "name":"Owais"
            // },
            "subject": `Appointment Request: ${patientService}`,
            "templateId":1,
            "params":{

                "patient_service": patientService,
                "patient_name":  patientName,
                "patient_email": patientEmail,
                "patient_message" : patientMessage,
                "patient_phone" : patientPhone,
                // "patient_time" : patientTime
            },
            "messageVersions":[
                
                //Definition for Message Version 1 
                {
                    "to":[
                        {
                        "email":"bob@example.com",
                        "name":"Bob Anderson"
                        },
                        {
                        "email":"anne@example.com",
                        "name":"Anne Smith"
                        }
                    ],
                    "params":{
                        "greeting":"Welcome onboard!",
                        "headline":"Be Ready for Takeoff."
                    },
                    "subject":"We are happy to be working with you"
                },
                
                // Definition for Message Version 2
                {
                    "to":[
                        // {
                        // "email":"umerkhattab42@gmail.com",
                        // "name":"Owais"
                        // },
                        {
                        "email": patientEmail,
                        "name": patientName
                        },
                        // {
                        // "email":"andrea@example.com",
                        // "name":"Andrea Wallace"
                        // }
                    ],
                    "params":{
                        "greeting":"Hello there..."
                    }
                }
            ]
            });

            const xhr = new XMLHttpRequest();
                  xhr.open("POST", "https://api.brevo.com/v3/smtp/email");
                  xhr.setRequestHeader("accept", "application/json")
                  xhr.setRequestHeader("api-key", "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")
                  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
                  xhr.onreadystatechange = function() {
                        after_form_submitted(xhr);   
                  }

                  xhr.send(params);

        // $.ajax({
        //         type: "POST",
        //         url: 'https://api.brevo.com/v3/smtp/email',
        //         data: $form.serialize(),
        //         success: after_form_submitted,
        //         dataType: 'json' 
        //     });        
        
      });	
});
