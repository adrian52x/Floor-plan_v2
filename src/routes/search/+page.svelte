<script>
    import { page } from "$app/stores";
    import { fly } from 'svelte/transition';
    import * as xlsx from 'xlsx';
    //console.log($page.params);

    let csvData = [];
  let error = null;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const workbook = xlsx.read(result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      csvData = xlsx.utils.sheet_to_json(sheet);

      console.log("csvData", csvData);
    };
    reader.readAsBinaryString(file);
  };
</script>

<div class=" fixed bg-gray-100 border-r-2 shadow-lg w-full h-full" transition:fly={{x: -1000, opacity: 1}}> 

    <label for="file-upload">Choose a CSV file:</label>
    <input type="file" id="file-upload" accept=".xlsx,.xls" on:change={handleFileUpload}>

    {#if error}
        <p>{error}</p>
    {:else if csvData.length}
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
    {:else}
        <p>No data uploaded yet.</p>
    {/if}

</div>



<style>
    table, th, td {
      border: 1px solid black;
      border-collapse: collapse;
      padding: 0.5rem;
    }
    th {
      font-weight: bold;
    }
  </style>