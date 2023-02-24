<script>
    import { page } from "$app/stores";
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { saveAs } from 'file-saver';
    import * as xlsx from 'xlsx';
    import Modal from "../../components/Modal.svelte";
    import toast, { Toaster } from 'svelte-french-toast';
    import { baseURL } from "../../store/store";


    //console.log($page.params);


    let objects = [];
    let csvData = [];

    let showModal = false;


    const requiredColumns = ['name', 'objectType', 'floor', 'building', 'equipment'];

    function validateCsvData(csvData) {
      let errors = [];

      // Check if csvData is not empty
      if (csvData.length === 0) {
        errors.push('No data imported.');
      }

      // Check if csvData is an array
      if (!Array.isArray(csvData)) {
        errors.push('Invalid data format');
      }

    // Check if all required columns are present
      if (csvData.length > 0) {
        const columns = Object?.keys(csvData[0]);

        if (!requiredColumns.every(col => columns.includes(col))) {
        errors.push('CSV file does not have all required columns');
      }
      } else {
        errors.push('Not compatible');

      }

      // Check if there are any extra columns
      if (csvData.length > 0) {
        const columns = Object?.keys(csvData[0]);
        const hasExtraColumns = columns.length > requiredColumns.length
          if (hasExtraColumns) {
            errors.push('The uploaded file contains extra columns.');
        }
      }
      return errors;
    }

    async function handleSubmit() {
 
      let validationErrors = validateCsvData(csvData);

      if (validationErrors.length > 0) {
        // Display validation errors to the user
        toast.error(validationErrors.join('\n'));
        return;
      }


                const result = await fetch(`${baseURL}/api/manyObjects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(csvData)
                });
                console.log(await result.json())

                if(result.status === 200){
                    toast.success("File uploaded");
                }else if(result.status === 400){
                  toast.error("Something wrong");
                }

         

    }

    let activeTab = 'Import';
    const handleTabClick = (event) => {
        activeTab = event.target.dataset.tab;
    };


    function downloadExcel() {

        // const fields = ['name', 'objectType', 'floor', 'building', 'equipment'];
        // const headers = fields.map(field => ({ header: field, key: field }));


        const objectsToExport = objects.map(obj => {
            return {
                name: obj.name,
                objectType: obj.objectType,
                floor: obj.floor,
                building: obj.building,
                equipment: obj.equipment
            }
        });

        const worksheet = xlsx.utils.json_to_sheet(objectsToExport);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Objects');
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelBlob, 'objects.xlsx');
    }


  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const fileType = file.type;
    if (!(fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.ms-excel')) {
        toast.error("Not an Excel file");
    } 

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const workbook = xlsx.read(result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert name value to a string to preserve leading zeros
        csvData = xlsx.utils.sheet_to_json(sheet, {raw: true}).map(obj => {
            obj.name = obj.name.toLocaleString('en-US', {minimumIntegerDigits: 2})
            return obj; 
        });

      console.log("csvData", csvData);
    };
    reader.readAsBinaryString(file);
  };


</script>

<Toaster />




<div class="fixed bg-gray-100 border-r-2 shadow-lg w-full h-full" transition:fly={{x: -1000, opacity: 1}}> 

    <main>
        <div class="tabs">
          <button
            class="tab font-digits hover:underline"
            on:click={handleTabClick}
            class:selected={activeTab === 'Import'}
            data-tab="Import"
          >
            Import
          </button>
          <button
            class="tab font-digits hover:underline"
            on:click={handleTabClick}
            class:selected={activeTab === 'Export'}
            data-tab="Export"
          >
            Export
          </button>
        </div>
      
        <div class="card">
          
            {#if activeTab === 'Import'}

                <div class="text-align">
                    <p class="font-digits text-xl">Data Import</p>
                    <p>Import or sync your assets data</p>
                <br>

                <form on:submit|preventDefault={handleSubmit}>
                    <input class="font-digits" type="file" accept=".xlsx" on:change={handleFileUpload}>
                    <button class="font-digits bg-green-200" type="submit">Upload File</button>
                </form>
            </div>

            {#if csvData.length}
              <p class="text-align my-4"> {csvData.length} rows imported.</p>

                <div class="container" >
                    <table>
                        <thead>
                            <tr>
                                {#each Object.keys(csvData[0]) as column}
                                <th>{column}</th>
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each csvData as row}
                                <tr>
                                    {#each Object.values(row) as cell}
                                        <td>{cell}</td>
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

            {:else}
              <p class="text-align my-8">No data imported yet.</p>
              <button class="underline" on:click={() => showModal = true}> Show file example</button>
  
              <Modal bind:showModal>
                <div class="modal-content">
                  <!-- svelte-ignore a11y-img-redundant-alt -->
                  <img src="/import_example.jpg" alt="Image">
                </div>
              </Modal>

            {/if}
          {:else if activeTab === 'Export'}

          
        <div class="text-align">  
            <p class="font-digits text-xl">Data Export</p>
            <p>Export desks/meeting rooms/printer rooms as Excel file</p>  
            <button class="font-digits bg-green-200 my-8" on:click={downloadExcel}>Download</button>
        </div>

          {/if}
        </div>
      </main>




</div>



<style>
    main {
    margin-top: 20px;    
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .text-align{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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




    table, th, td {
      border: 1px solid black;
      border-collapse: collapse;
      padding: 0.5rem;
    }
    th {
      font-weight: bold;
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

.container {
  margin-left: 20%;
  width: auto;
  text-align: center;
  overflow-y: scroll;
  height: calc(100vh - 300px);
  margin-bottom: 100px;
}

    ::-webkit-scrollbar {
      width: 6px;
      background-color: #ffffffe7;
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: #d3d3d3;
      border-radius: 10px;
    }
    
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: #b8b8b8;
      width: 15px;
    }

    .modal-content {
    max-width: 100%;
    max-height: 100%;
  }
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
  </style>