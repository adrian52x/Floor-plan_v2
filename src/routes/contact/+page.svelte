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
            <button class="tab font-digits hover:underline">Admin Panel</button>
        </div>    


        <!-- svelte-ignore a11y-label-has-associated-control -->
        <div class="card">
       

            
            <div class="field font-digits my-4 ml-4">
                <label class="label">Nothing here yet</label>
                
            </div>
                
            
           

            
            
        </div>
    </main>

</div>