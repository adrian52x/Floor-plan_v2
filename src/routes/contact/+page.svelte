<script>
       import { fly } from 'svelte/transition';
       import { receiverEmail } from '../../store/store';
       import toast, { Toaster } from 'svelte-french-toast';

    let fullName;
    let email = receiverEmail;
    let subject;
    let type;
    let number;
    let message;


    let submitMailNotifi = false;
    const submitMail = async () => {
      submitMailNotifi = !submitMailNotifi;

      if(submitMailNotifi){
        toast.success('Email sent successfully');
            setTimeout(() => {
                submitMailNotifi = false;
            }, 3000);   
      }  
           
       
            await fetch(`http://localhost:3000/api/sendmail`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                fullName: fullName,
                email: email,
                subject: subject,
                type: type,
                number: number,
                message: message
                })   
            });

         
    number = '';
    message = ' ';
    fullName = ' ';
        
            
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
    cursor: pointer;
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
            <button class="tab font-digits hover:underline">Contact form </button>
        </div>    


        <!-- svelte-ignore a11y-label-has-associated-control -->
        <div class="card">
        <form on:submit|preventDefault={submitMail} class="box">

            
            <div class="field font-digits my-4 ml-4">
                <label class="label">Full name</label>
                <div class="control">
                    <input class="input rounded-md" type="text" bind:value={fullName} placeholder="Your name" required>
                </div>
            </div>
                
            
            <div class="field font-digits my-4 ml-4">
                <label class="label">Subject</label>
                <div class="control">
                    <select class="rounded-md" bind:value={subject} required>
                        <option value="" disabled selected hidden>Select a subject</option>
                        <option value="Missing/request equipment">Missing/request equipment</option>
                        <option value="Equipment malfunction">Equipment malfunction</option>
                    </select>
                </div>
            </div>

            <div class="field font-digits my-4 ml-4">
                <label class="label">Desk / Meeting room / Printer room</label>
                <div class="control">
                    <select class="rounded-md" bind:value={type} required>
                        <option value="" disabled selected hidden>Select type</option>
                        <option value="Desk">Desk</option>
                        <option value="Meeting room">Meeting room</option>
                        <option value="Printer room">Printer room</option>
                    </select>
                </div>
            </div>

            <div class="field font-digits my-4 ml-4">
                <label class="label">Floor & Number</label>
                <div class="control has-icons-left has-icons-right">
                    <input class="input rounded-md" type="text" bind:value={number} placeholder="<floor>.<number>" required >
                    <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                    </span>
                </div>
            </div> 
                
            <div class="field font-digits my-4 ml-4">
                <label class="label">Message</label>
                <div class="control">
                    <textarea class="textarea rounded-md" bind:value={message} placeholder="..." required ></textarea>
                </div>
            </div>
                
                
            <div class="field is-grouped">
                <div class="control">
                    <button class="font-digits rounded-md bg-green-200 my-4 ml-4">Submit</button>
                </div>
            </div>

            

            
            </form>
            
        </div>
    </main>

</div>