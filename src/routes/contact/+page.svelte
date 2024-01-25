<script>
    import { fly } from 'svelte/transition';
    import { receiverEmail } from '../../store/store';
    import toast, { Toaster } from 'svelte-french-toast';
    import { baseURL } from '../../store/store';

 let fullName;
 let email = receiverEmail;
 let subject;
 let message;


 let requestSent = false;

const sendRequest = async () => {
  try {
    requestSent = true;
    const response = await fetch(`${baseURL}/api/sendmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName,
        email: email,
        subject: subject,
        message: message
      })
    });

    if (response.ok) {
        return;
    } else {
        toast.error('An error occurred while sending the email.');
    }
  } catch (error) {
    console.log('Error sending request:', error);
  }
}


const submitMail = async () => {
    await toast.promise(
        sendRequest(),
        {
            loading: 'Sending...',
            success: 'Email sent successfully!',
            error: 'Could not send.',
        }
    );

}

$: {

    if(requestSent){
        setTimeout(() => {
            requestSent = false; 
        }, 5000); 
    }
}

</script>

<style>


 main {
 margin-top: 20px;    
 display: flex;
 flex-direction: column;
 align-items: center;
}

 .card {
box-shadow: 0px 4px 8px rgba(129, 128, 128, 0.2);
margin-left: -100px;
border-radius: 8px;
width: 50%;
margin-bottom: 20px;
overflow: hidden;
display: flex;
flex-direction: column;
}

.tabs {
 margin-left: -100px;
 display: flex;
 justify-content: space-evenly;
 margin-bottom: 1rem;
}

.tab {
 background-color: transparent;
 border: none;
 color: #333;
 font-size: 1.25rem;
 padding: 0.5rem 1rem;
 text-align: center;
 text-transform: uppercase;
}

</style>

<Toaster />


<div class="fixed bg-gray-100 border-r-2 shadow-lg w-full h-full" transition:fly={{x: -1000, opacity: 1}}>
 <main>

    <div class="tabs">
        <button class="tab font-digits">Feedback</button>
    </div>    


    <div class="card">

        <div class="my-4 ml-4">
            <div class="font-defaultText label">You are welcome to write your feedback (Improvement/Suggestion/Report an issue)</div>
            <div class="font-digits mt-8 w-fit py-2 px-2 rounded-md border border-green-300 hover:bg-green-200"> <a href="mailto:agcfloorplan@outlook.com">agcfloorplan@outlook.com</a> </div>
        </div>
     
     
         
    </div>
 </main>

</div>