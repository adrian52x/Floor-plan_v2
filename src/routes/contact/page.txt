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
         <button class="tab font-digits">Feedback form </button>
     </div>    


     <!-- svelte-ignore a11y-label-has-associated-control -->
     <div class="card">
     <form on:submit|preventDefault={submitMail} class="box">

         
         <div class="field font-digits my-4 ml-4">
             <label class="label">Name</label>
             <div class="control">
                 <input class="input rounded-md" type="text" bind:value={fullName} placeholder="Your name" required>
             </div>
         </div>
             
         
         <div class="field font-digits my-4 ml-4">
             <label class="label">Subject</label>
             <div class="control">
                 <select class="rounded-md" bind:value={subject} required>
                     <option value="" disabled selected hidden>Select a subject</option>
                     <option value="Improvement/Suggestion">Improvement/Suggestion</option>
                     <option value="Report an issue">Report an issue</option>
                 </select>
             </div>
         </div>

         <div class="field font-digits my-4 ml-4">
             <label class="label">Message</label>
             <div class="control">
                 <textarea class="textarea rounded-md w-80 h-28" bind:value={message} placeholder="..." required ></textarea>
             </div>
         </div>
             
             
         <div class="field is-grouped">
             <div class="control">
                 <button class={`${requestSent ? 'bg-gray-300 pointer-events-none' : ''} px-2 py-2 font-digits rounded border border-green-300 hover:bg-green-400 my-4 ml-4`}>Submit</button>
             </div>
         </div>

         

         
         </form>
         
     </div>
 </main>

</div>